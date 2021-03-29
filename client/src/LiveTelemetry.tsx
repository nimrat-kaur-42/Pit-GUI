// /client/App.js
import React, { Component } from "react"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Map from "./Map"
import axios from "axios"
import SessionButton from "./SessionButton"

function ThreeRow(item1, item2, item3) {
  return (
    <Row>
      <Col>
        {item1}
      </Col>
      <Col>
        {item2}
      </Col>
      <Col>
        {item3}
      </Col>
    </Row>
  )
}

interface TelemetryData {
  label: string
  value: string
}

function telemetryRow(data1: TelemetryData, data2: TelemetryData, data3: TelemetryData) {
  return (
    <React.Fragment>
      { ThreeRow(<strong>{data1.label}</strong>, <strong>{data2.label}</strong>, <strong>{data3.label}</strong>)}
      { ThreeRow(data1.value, data2.value, data3.value)}
    </React.Fragment>
  )
}


class LiveTelemetry extends Component {
  state = {
    speed: 0,
    lowCellVoltage: 0,
    highCellVoltage: 0,
    avgCellVoltage: 0,
    packSumVoltage: 0,
    duration: 0,
    temperature: 0,
    stateOfCharge: 0,
    consumption: 0,
    panelPower: 0,
    heading: 90,
    carLocation: {
      lat: 29.651979,
      lng: -82.32502,
    },
    loading: true,
  };

  componentDidMount() {
    setInterval(this.getDataFromDb, 100);
  }

  getDataFromDb = () => {
    axios.get("/api/live/data").then((res) => {
      var { voltage } = res.data
      var { gps } = res.data
      // console.log(res.data) //TODO
      if (res.data) {
        if (voltage) {
          this.setState({
            lowCellVoltage: voltage.lowCellVoltage,
            highCellVoltage: voltage.highCellVoltage,
            avgCellVoltage: voltage.avgCellVoltage,
            packSumVoltage: voltage.packSumVoltage,
          })
        }
        if (gps) {
          this.setState({
            heading: gps.heading,
            speed: gps.speed,
            carLocation: {
              lat: parseFloat(gps.latitude),
              lng: parseFloat(gps.longitude)
            },
          })
        }
        this.setState({

          loading: false
        })
      }
      else {
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const {
      speed,
      lowCellVoltage,
      highCellVoltage,
      avgCellVoltage,
      packSumVoltage,
      // duration,
      // temperature,
      // stateOfCharge,
      // consumption,
      // panelPower,
      carLocation,
      heading,
      loading,
    } = this.state;

    if (loading) return <p>Loading....</p>;

    return (
      <div>
        <SessionButton />
        <Row>
          <h1>Live Telemetry</h1>
          <Map center={carLocation} zoom={64} heading={heading} />
        </Row>
        <Row>
          {/* GPS */}
          <Col className="rounded mt-5 pb-3 text-center" style={{ border: '4px solid #343a40' }}>
            <h3 style={{ marginTop: '-17px', background: 'white', display: 'table' }}>Speed</h3>
            {
              telemetryRow({
                label: "Speed",
                value: String(speed) + ""
              },
                {
                  label: "Heading",
                  value: String(heading) + ""
                },
                {
                  label: "",
                  value: ""
                })
            }

            {
              telemetryRow({
                label: "Latitude",
                value: String(carLocation.lat) + ""
              },
                {
                  label: "Longitude",
                  value: String(carLocation.lng) +""
                },
                {
                  label: "",
                  value: ""
                })
            }
            {/* 
              {
                telemetryRow({
                  label: "State of Charge",
                  value: "0.00"
                },
                {
                  label: "Volt. (40-72V)",
                  value: "0.00 V"
                },
                {
                  label: "Curr.(0-480A)",
                  value: "0.00 A"
                })
              } */}

          </Col>
          {/* BMS */}
          <Col className="rounded mt-5 pb-3 text-center" style={{ border: '4px solid #343a40' }}>
            <h3 style={{ marginTop: '-17px', background: 'white', display: 'table' }}>BMS</h3>
            {
              telemetryRow({
                label: "State of Charge",
                value: String(lowCellVoltage) + " V"
              },
                {
                  label: "Volt. (40-72V)",
                  value: String(highCellVoltage) + " V"
                },
                {
                  label: "Curr.(0-480A)",
                  value: String(avgCellVoltage) + " V"
                })
            }

            {
              telemetryRow({
                label: "Pack Sum Voltage",
                value: String(packSumVoltage) + " V"
              },
                {
                  label: "",
                  value: ""
                },
                {
                  label: "",
                  value: ""
                })
            }
            {/* 
              {
                telemetryRow({
                  label: "State of Charge",
                  value: "0.00"
                },
                {
                  label: "Volt. (40-72V)",
                  value: "0.00 V"
                },
                {
                  label: "Curr.(0-480A)",
                  value: "0.00 A"
                })
              } */}

          </Col>
          <Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LiveTelemetry;
