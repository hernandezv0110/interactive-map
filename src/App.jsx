import React from "react";
import * as d3 from "d3";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import homePic from "./home.png";
import { useEffect, useState } from "react";
import heatmap from "./assets/heatmap.png";
import PercentageBar from "./PercentageBar";
import workAreas from "./workareas";

const OCEIA = [37.7795, -122.4134]; // OCEIA OFFICE
const centerPos = [37.75229331053556, -122.44582875807029];

const homeIcon = new L.Icon({
  iconUrl: homePic,
  iconSize: [25, 25],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const getColor = (interactionCount, min, max) => {
  const colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([500, max]);
  return colorScale(interactionCount);
};

const getCenter = (zones) => {
  let latSum = 0,
    lngSum = 0,
    count = 0;
  zones.forEach((zone) => {
    zone.coordinates.forEach(([lng, lat]) => {
      latSum += lat;
      lngSum += lng;
      count++;
    });
  });
  return [latSum / count, lngSum / count];
};

function HoverMarker({ position, content }) {
  const map = useMap();

  useEffect(() => {
    const marker = L.marker(position, { icon: homeIcon }).addTo(map);
    const popup = L.popup({ offset: [0, -10] }).setContent(content);

    marker.on("mouseover", () => {
      marker.bindPopup(popup).openPopup();
    });

    marker.on("mouseout", () => {
      marker.closePopup();
    });

    return () => {
      map.removeLayer(marker);
    };
  }, [map, position, content]);

  return null;
}

const updateWorkAreaName = (workArea) => {
  var workName = "";
  if (workArea === "Mid-Market/Tenderloin") {
    workName = "Mid-Market";
  } else if (workArea === "Chinatown") {
    workName = workArea;
  } else if (workArea === "District 5") {
    workName = "D5";
  } else if (workArea === "Mission") {
    workName = workArea;
  } else if (workArea === "Outer Sunset") {
    workName = workArea;
  } else if (workArea === "D10 Southeast") {
    workName = "D10";
  }

  return workName;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [fiscalYear, setFiscalYear] = useState("");
  const [dataDate, setDataDate] = useState("");
  const [zone, setZone] = useState("");
  const [area, setArea] = useState("");
  const [selectedTeamData, setSelectedTeamData] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedZoneData, setSelectedZoneData] = useState("");
  const [textColor, setTextColor] = useState("black");

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzzODq2k4wIAeaQOnNvHDa0A_2UBt8IGUAp1-qKG64CUwQmummQT1x7y64FJkD7PEG8/exec"
    ) // Replace with your actual URL
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbylBKCEVE4R6628IMyukmowRo8aSpG8TgtHWEzGfy10uyF791PN3v9DvPS6q5L8fE2MTQ/exec"
    ) // Replace with your actual URL
      .then((response) => response.json())
      .then((json) => {
        console.log("Fetched Data:", json);
        setTeamData(json);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbwxtJTpvAPtYkjHYeVw1XRDMLbvPq_oCOAcr2t4cXKRMtDq_z6MO_CDI_S_4vPGcuQ_/exec"
    ) // Replace with your actual URL
      .then((response) => response.json())
      .then((json) => {
        setFiscalYear(json["Fiscal Year"]);
        setDataDate(new Date(json["Data Date"]).toLocaleDateString("en-US"));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getMinMaxInteractions = () => {
    if (data.length === 0) return { min: 0, max: 0 };

    const interactions = data.map((item) => item.Interactions);
    return {
      min: Math.min(...interactions),
      max: Math.max(...interactions),
    };
  };

  const { min, max } = getMinMaxInteractions();

  const getInteractions = (workArea, workZone) => {
    var workName = "";
    if (workArea === "Mid-Market/Tenderloin") {
      workName = "Mid-Market";
    } else if (workArea === "Chinatown") {
      workName = workArea;
    } else if (workArea === "District 5") {
      workName = "D5";
    } else if (workArea === "Mission") {
      workName = workArea;
    } else if (workArea === "Outer Sunset") {
      workName = workArea;
    } else if (workArea === "D10 Southeast") {
      workName = "D10";
    }
    const result = data.find(
      (item) => item["Work Area"] === workName && item["Work Zone"] === workZone
    );
    return result ? Number(result.Interactions) : 0;
  };

  const getPercentage = (workArea, workZone) => {
    const workZoneInteractions = getInteractions(workArea, workZone);
    const updatedWorkArea = updateWorkAreaName(workArea);
    const filtered = data.filter(
      (item) => item["Work Area"] === updatedWorkArea
    );
    const total = filtered.reduce((sum, item) => sum + item.Interactions, 0);
    const percentage = (workZoneInteractions / total) * 100;
    return percentage.toFixed(0);
  };

  return (
    <div className="page">
      <div className="content">
        <div className="text">
          <div className="heading">
            <h1 className="title">
              Community Ambassadors Program Impact Fiscal Year-to-Date{" "}
            </h1>
            <h3 className="subtitle">
              FY {fiscalYear} Total Interactions by Team
            </h3>
          </div>
          <div className="instructions">
            <div style={{ marginTop: "25px", padding: "0 20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>
                  Interact with the map by clicking on a team's work zone to
                  learn more!
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <label htmlFor="fiscalYear" style={{ fontSize: "14px" }}>
                    Fiscal Year Selected:
                  </label>
                  <select
                    id="fiscalYear"
                    style={{ padding: "6px 10px", borderRadius: "4px" }}
                  >
                    <option>FY 2025-2026</option>
                    <option>FY 2024-2025</option>
                  </select>
                </div>
              </div>
            </div>
            {area.length > 0 && (
              <h2
                style={{
                  borderTop: `5px solid ${selectedColor}`,
                  borderBottom: `5px solid ${selectedColor}`,
                  color: `${textColor}`,
                }}
              >
                {area}, {zone}
              </h2>
            )}
          </div>
          {zone.length > 0 && (
            <div className="zone-section">
              <h3>
                {zone} has{" "}
                <span className="highlighted-number">
                  {selectedZoneData.toLocaleString()}
                </span>{" "}
                total interactions!
              </h3>
            </div>
          )}
          {selectedTeamData.length > 0 && (
            <div className="team-section">
              <div className="field-data">
                <p>{area} Field Service Data</p>
                <div className="team-grid">
                  {selectedTeamData.map((item, index) => (
                    <div
                      key={index}
                      className="team-card animate-card"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        boxShadow: `0px 6px 20px ${selectedColor}`,
                      }}
                    >
                      <h4>{item["Field Service"]}</h4>
                      <p className="interaction_number">
                        {item.Interactions.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="zone-data"
                style={{ position: "relative", display: "inline-block" }}
              >
                <p className="zone-title">
                  {zone} Interaction Distribution Percentage
                </p>
                <PercentageBar
                  interactionPercentage={getPercentage(area, zone)}
                  color={selectedColor}
                />
                <p className="zone-description">
                  {" "}
                  Contributed {getPercentage(area, zone)}% of all interactions
                  in {area}.
                </p>
              </div>
            </div>
          )}
          <div className="footer">
            <div className="city-text">
              <p>City and County of San Francisco</p>
              <p>Data through {dataDate}</p>
            </div>
            <div className="map-guide">
              <h3>Map Legend</h3>
              <div className="legend">
                <span className="legend-label">Less Interactions</span>
                <div className="legend-container">
                  <img
                    src={heatmap}
                    alt="Heatmap Legend"
                    className="legend-bar"
                  />
                  <div className="legend-markers">
                    <span className="marker" style={{ left: "15%" }}>
                      0
                    </span>
                    <span className="marker" style={{ left: "50%" }}>
                      {Math.floor(max / 2)}
                    </span>
                    <span className="marker" style={{ left: "85%" }}>
                      {max}
                    </span>
                  </div>
                </div>
                <span className="legend-label">More Interactions</span>
              </div>
            </div>
          </div>
          <footer
            style={{
              textAlign: "center",
              fontSize: "0.85rem",
              color: "#888",
              padding: "1em 0",
            }}
          >
            © 2025 CAP Interactions. Supported by{" "}
            <a
              href="https://www.sf.gov/departments--city-administrator--office-civic-engagement-and-immigrant-affairs"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              The Office of Civic Engagement and Immigrant Affairs (OCEIA)
            </a>
          </footer>
        </div>
        <div className="map" style={{ height: "100vh", width: "100vw" }}>
          {loading ? (
            <div className="loading">Loading map...</div>
          ) : (
            <MapContainer
              center={centerPos}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">Carto</a>'
              />
              {/* Home Icon with Hover Popup */}
              <HoverMarker
                position={OCEIA}
                content="OCEIA OFFICE: 1145 Market Street"
              />

              {/* Work Areas and Zones */}
              {workAreas.map((area, index) => (
                <>
                  <Marker position={getCenter(area.zones)} opacity={0}>
                    <Tooltip permanent direction="center" opacity={0.6}>
                      {area.name}
                    </Tooltip>
                  </Marker>
                  {area.zones.map((zone, zIndex) => (
                    <Polygon
                      key={`zone-${zIndex}`}
                      positions={zone.coordinates.map((coord) => [
                        coord[1],
                        coord[0],
                      ])}
                      color={getColor(
                        getInteractions(area.name, zone.name),
                        min,
                        max
                      )}
                      fillOpacity={0.5}
                      eventHandlers={{
                        mouseover: (e) => {
                          const layer = e.target;
                          layer.bindPopup(zone.name).openPopup();
                        },
                        mouseout: (e) => {
                          const layer = e.target;
                          layer.closePopup();
                        },
                        mousedown: (e) => {
                          setZone(zone.name);
                          setArea(area.name);
                          setSelectedColor(
                            getColor(
                              getInteractions(area.name, zone.name),
                              min,
                              max
                            )
                          );

                          setSelectedZoneData(
                            getInteractions(area.name, zone.name)
                          );

                          const teamDetails = teamData.filter(
                            (item) => item["Team"] === area.name
                          );

                          setSelectedTeamData([]);
                          setTimeout(
                            () => setSelectedTeamData(teamDetails),
                            100
                          );
                        },
                      }}
                    />
                  ))}
                </>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
