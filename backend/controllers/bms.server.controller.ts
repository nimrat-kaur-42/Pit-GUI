import { NextFunction, Request, Response } from "express"
import Mitsuba_RX0 from "../shared/models/Mitsuba/RX0"
import DistanceTraveled from "../shared/models/Stats/DistanceTraveled"
import { getMostRecent } from "../helper/helper.route"
import { WHEEL_RADIUS_MI } from "../shared/sdk/telemetry"
import { calculatePower } from "../helper/math"
import Mitsuba_RX1 from "../shared/models/Mitsuba/RX1"
import BMS_RX2 from "../shared/models/BMS/RX2"
import BMS_RX1 from "../shared/models/BMS/RX1"
import BMS_RX0 from "../shared/models/BMS/RX0"
import { Op } from "sequelize"


export const rx2Middleware = async (req: Request, res: Response, next: NextFunction) => {
    // get the last rpm value
    const recentRx0 = await getMostRecent(BMS_RX0)
    const recentRx2 = await getMostRecent(BMS_RX2)

    // there is no recent value
    if (!recentRx0 || !recentRx2) {
        return next()
    }
    const currentRx0 = await getMostRecent(
        BMS_RX0,
        {
            id: {
                [Op.not]: recentRx0.id
            }
        }
    )

    if (!currentRx0) {
        return next()
    }

    if (Math.abs(recentRx0.createdAt.getDate() - currentRx0.createdAt.getDate()) > 5) {
        return next()
    }

    // call common method
    await calculatePower(
        recentRx0,
        recentRx2,
        currentRx0,
        req.body
    )

    next()
}
