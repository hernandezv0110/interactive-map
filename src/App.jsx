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

const OCEIA = [37.7795, -122.4134]; // OCEIA OFFICE
const centerPos = [37.75229331053556, -122.44582875807029];

const homeIcon = new L.Icon({
  iconUrl: homePic,
  iconSize: [25, 25],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const getColor = (interactionCount, min, max) => {
  const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([500, max]);
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

const workAreas = [
  {
    name: "Mid-Market/Tenderloin",
    zones: [
      {
        name: "Zone 1",
        //color: "dodgerblue",
        coordinates: [
          [-122.40803478425775, 37.78400274444728],
          [-122.40854149778664, 37.78439579624181],
          [-122.40869163512829, 37.78535246074256],
          [-122.41169292199542, 37.78500265633858],
          [-122.41387035157217, 37.78474764147204],
          [-122.41603311599388, 37.78444955988098],
          [-122.41531491622327, 37.78074331500913],
          [-122.41171144502678, 37.78122332069056],
          [-122.40804724116936, 37.78400729217405],
        ],
      },
      {
        name: "Zone 2",
        //color: "skyblue",
        coordinates: [
          [-122.41612366506388, 37.78443394157216],
          [-122.4153641883706, 37.7806527707686],
          [-122.41169332392249, 37.781106099301326],
          [-122.41468244500896, 37.77884709677447],
          [-122.4147863941441, 37.77877574807634],
          [-122.41501778760706, 37.77891944661555],
          [-122.41824903068566, 37.778521010540715],
          [-122.41816639016321, 37.777965807101126],
          [-122.41966600342404, 37.777805991646375],
          [-122.42098875354984, 37.784317057091755],
          [-122.41777635496248, 37.78471198784801],
          [-122.41768870323753, 37.78425016785927],
          [-122.41612755356164, 37.784433251523055],
        ],
      },
      {
        name: "Zone 3",
        //color: "lightblue",
        coordinates: [
          [-122.41967479158174, 37.777738322089846],
          [-122.41805978777845, 37.77793796209993],
          [-122.41816694442892, 37.778458233532106],
          [-122.41499632415722, 37.77885244643279],
          [-122.41445288685851, 37.77844107151809],
          [-122.41351001157079, 37.777702937713386],
          [-122.41165466187819, 37.77620097205438],
          [-122.41319411484591, 37.774995416845044],
          [-122.41576392181733, 37.773003790793],
          [-122.41667508406806, 37.77212351364619],
          [-122.41694506603226, 37.77175479578122],
          [-122.41821760560119, 37.772266772874175],
          [-122.4188112049105, 37.7725192156997],
          [-122.4199403770262, 37.77011403593394],
          [-122.4210916239795, 37.77019585570319],
          [-122.42210257176941, 37.77055881779728],
          [-122.42265883158109, 37.770968406380234],
          [-122.42304745144945, 37.77148038891822],
          [-122.42328570103237, 37.77185972898832],
          [-122.42195220148432, 37.77290174774079],
          [-122.42083446556168, 37.77385150591391],
          [-122.41913450123215, 37.7752020347817],
          [-122.41965415142339, 37.77773984806683],
        ],
      },
      {
        name: "Zone 4",
        //color: "skyblue",
        coordinates: [
          [-122.41462778778902, 37.77873037303951],
          [-122.40807556274868, 37.78399281150135],
          [-122.40496437957736, 37.78148523010563],
          [-122.41156303158546, 37.77626740296708],
          [-122.41463932020572, 37.77871435196339],
        ],
      },
    ],
  },
  {
    name: "Chinatown",
    zones: [
      {
        name: "Zone 1",
        //color: "navy",
        coordinates: [
          [-122.40790466013804, 37.798700462617646],
          [-122.41045232512653, 37.79837965145484],
          [-122.40974991524314, 37.7947243785747],
          [-122.40334885006018, 37.795548840840866],
          [-122.40790554783547, 37.79869596308528],
        ],
      },
      {
        name: "Zone 2",
        //color: "navy",
        coordinates: [
          [-122.40972607540053, 37.79469784845962],
          [-122.40937042628377, 37.792960729701235],
          [-122.40772593096561, 37.793177317723604],
          [-122.4075483927399, 37.792258069254714],
          [-122.4059552879007, 37.792488196196416],
          [-122.40558265463389, 37.79056888091026],
          [-122.40545364670743, 37.790592244280475],
          [-122.40519478362936, 37.7906237115737],
          [-122.40544441012817, 37.791540286433275],
          [-122.40471936826307, 37.791636979571805],
          [-122.40489676677026, 37.79247389332738],
          [-122.40429480284064, 37.792537318885024],
          [-122.40487826923666, 37.79533670268964],
          [-122.40972666339201, 37.794698130916274],
        ],
      },
    ],
  },
  {
    name: "District 5",
    zones: [
      {
        name: "Zone 1",
        //color: "lightblue",
        coordinates: [
          [-122.42283272748196, 37.77595418692822],
          [-122.42227032011209, 37.77317046065315],
          [-122.42360002569484, 37.772991979393225],
          [-122.42343753220956, 37.77206357579361],
          [-122.42376995860519, 37.772038786383476],
          [-122.42450070836742, 37.775721289607205],
          [-122.42943625291441, 37.775081524797784],
          [-122.42962658510791, 37.776007145569565],
          [-122.43609570989904, 37.77518745681665],
          [-122.43647351558252, 37.777042620837705],
          [-122.42816782933976, 37.77811831028731],
          [-122.42789829875557, 37.77679437048275],
          [-122.42144488508393, 37.777594079721965],
          [-122.42135450815843, 37.77709801252402],
          [-122.41981341123139, 37.77728781092911],
          [-122.41961582889479, 37.77636218245344],
          [-122.42284071620904, 37.775960023700705],
        ],
      },
      {
        name: "Zone 2",
        //color: "royalblue",
        coordinates: [
          [-122.42874748376516, 37.78094296469233],
          [-122.42820329394542, 37.77816584113576],
          [-122.43158386864596, 37.77772521055516],
          [-122.43195871248663, 37.779590238205174],
          [-122.43364533669433, 37.779370940042185],
          [-122.43420588287424, 37.78213493261403],
          [-122.43584018916286, 37.781927468044984],
          [-122.43604084637624, 37.78284288589049],
          [-122.4394049418161, 37.78243073587164],
          [-122.43979256641938, 37.78433575672898],
          [-122.43295038946769, 37.785217709695985],
          [-122.43281852890182, 37.78458018000531],
          [-122.43108499670302, 37.784785091732246],
          [-122.43083218749841, 37.78356898162862],
          [-122.43024269320456, 37.78363947893541],
          [-122.43006697214508, 37.782667295263636],
          [-122.43069137070617, 37.78259679703008],
          [-122.43033136754241, 37.78072498072325],
          [-122.4287507670316, 37.78093901277086],
        ],
      },
      {
        name: "Zone 3",
        //color: "dodgerblue",
        coordinates: [
          [-122.44039431631472, 37.7708131176349],
          [-122.44078659638626, 37.77277125980015],
          [-122.45407958247505, 37.77110395682804],
          [-122.45351519886307, 37.76813553964344],
          [-122.45060511376388, 37.76851894030102],
          [-122.4498642683347, 37.76479410397131],
          [-122.44966452917123, 37.76482446936777],
          [-122.45042849980749, 37.768576161523455],
          [-122.44497065683842, 37.76925531762426],
          [-122.44513300881022, 37.77019216887487],
          [-122.44043087729516, 37.770769254671194],
          [-122.44039433714337, 37.77080684289241],
        ],
      },
      {
        name: "Zone 4",
        //color: "lightblue",
        coordinates: [
          [-122.43651613638647, 37.77701932055216],
          [-122.43670869086051, 37.77800272919082],
          [-122.43849021373214, 37.777790634668136],
          [-122.43771399321983, 37.773996031657305],
          [-122.44090445166171, 37.773626910208094],
          [-122.44033166977985, 37.77081326919922],
          [-122.43715004344287, 37.77124589971193],
          [-122.43695839859856, 37.77027852375069],
          [-122.4269161757783, 37.77156139906876],
          [-122.42733601032418, 37.77350282971955],
          [-122.43554975796934, 37.77247594542844],
          [-122.43651051302211, 37.7770302757058],
        ],
      },
    ],
  },
  {
    name: "Mission",
    zones: [
      {
        name: "Zone 1",
        //color: "dodgerblue",
        coordinates: [
          [-122.40782199716179, 37.76839660420532],
          [-122.41073859929506, 37.768251904056],
          [-122.41086063285705, 37.76925515260113],
          [-122.41173927450404, 37.769351618090084],
          [-122.4148099147905, 37.769453411625065],
          [-122.41758558650375, 37.76955915540755],
          [-122.41838814669069, 37.76975949456974],
          [-122.41949984054745, 37.7699412153228],
          [-122.42032352073957, 37.76995791018727],
          [-122.42231184840927, 37.769837777429984],
          [-122.42178991066191, 37.76482325564551],
          [-122.40754836945399, 37.76570396721283],
          [-122.40782224772326, 37.768423782956546],
        ],
      },
      {
        name: "Zone 2",
        //color: "royalblue",
        coordinates: [
          [-122.40852787732976, 37.76562667281314],
          [-122.4083879370911, 37.764431903257105],
          [-122.41305956875757, 37.764114774600486],
          [-122.4128649346003, 37.76217644456236],
          [-122.4160332844607, 37.76198798204355],
          [-122.41587349605578, 37.76037355124811],
          [-122.4180386492016, 37.76025487505352],
          [-122.41733841165207, 37.75228255331602],
          [-122.41852408181154, 37.752199296436785],
          [-122.41943021169044, 37.76178157002846],
          [-122.4228172796814, 37.7615816551898],
          [-122.4228414258333, 37.76168091855783],
          [-122.42149416665438, 37.76174963926748],
          [-122.42184057645085, 37.76481239153733],
          [-122.40852122277099, 37.76562703892971],
        ],
      },
    ],
  },
  {
    name: "Outer Sunset",
    zones: [
      {
        name: "Zone 1",
        //color: "royalblue",
        coordinates: [
          [-122.50938503015985, 37.76395777824497],
          [-122.5090935612772, 37.76015578469497],
          [-122.47721696305535, 37.76163446728289],
          [-122.47675547065818, 37.761615265182485],
          [-122.47714409583489, 37.765378781473444],
          [-122.50935824889123, 37.763919477931765],
        ],
      },
      {
        name: "Zone 2",
        //color: "dodgerblue",
        coordinates: [
          [-122.48975596022797, 37.759354952492274],
          [-122.48641793343083, 37.75947551626996],
          [-122.48605504904825, 37.75437749571991],
          [-122.47619734236409, 37.7547704824822],
          [-122.47610854545707, 37.75345995398655],
          [-122.49542172782587, 37.75277397472804],
          [-122.4955184431306, 37.75403034730354],
          [-122.48731019364047, 37.75433773603925],
          [-122.48752331414815, 37.75756519885549],
          [-122.48968316310568, 37.75746936435576],
          [-122.48979335948101, 37.75935989474566],
        ],
      },
      {
        name: "Zone 3",
        //color: "royalblue",
        coordinates: [
          [-122.49945078284688, 37.74256898544736],
          [-122.49918257654184, 37.73831271435735],
          [-122.49674051937285, 37.738435508213925],
          [-122.4969271590576, 37.74114175119641],
          [-122.48213763757536, 37.74179105315926],
          [-122.48194815591341, 37.73897276517779],
          [-122.47964569120705, 37.739086625439384],
          [-122.47986390369674, 37.7418374989923],
          [-122.47541399159138, 37.74198651140577],
          [-122.47551318076752, 37.74352140984281],
          [-122.47904421795883, 37.7433959176594],
          [-122.47911644135748, 37.744758458897806],
          [-122.48118675831552, 37.744671395448094],
          [-122.48109234434199, 37.74331995500667],
          [-122.49945567777425, 37.74256235534541],
        ],
      },
    ],
  },
  {
    name: "D10 Southeast",
    zones: [
      {
        name: "Zone 1",
        //color: "dodgerblue",
        coordinates: [
          [-122.39884121837619, 37.71579081119499],
          [-122.40541045569773, 37.70777784357125],
          [-122.4203654565976, 37.71206404382981],
          [-122.41563722419781, 37.718156962591195],
          [-122.40077735146302, 37.72188827683037],
          [-122.39883853890123, 37.71581629884086],
        ],
      },
      {
        name: "Zone 2",
        //color: "dodgerblue",
        coordinates: [
          [-122.41559938844047, 37.71821537726257],
          [-122.41250861198577, 37.722625933496914],
          [-122.4162392895353, 37.73148842344632],
          [-122.40649031444494, 37.734902123038296],
          [-122.40414818879535, 37.7299293731098],
          [-122.40291729390762, 37.727360893692705],
          [-122.40136930429313, 37.72390128589876],
          [-122.40087170848747, 37.7223476543182],
          [-122.40066729241357, 37.721973653789064],
          [-122.40084354216815, 37.72194816770036],
          [-122.41561055015094, 37.718217517649165],
        ],
      },
      {
        name: "Zone 3",
        //color: "dodgerblue",
        coordinates: [
          [-122.40650801483318, 37.73518044718263],
          [-122.40766761737335, 37.73725680123097],
          [-122.40790828959886, 37.739385003695276],
          [-122.40760943024927, 37.74087451034222],
          [-122.40682177569363, 37.74232785249947],
          [-122.40551096422115, 37.743915807264955],
          [-122.40474518895856, 37.745386390517425],
          [-122.40437369986947, 37.74684162740286],
          [-122.37969871536271, 37.746768616992384],
          [-122.37912333371148, 37.73770661350328],
          [-122.39874960469733, 37.71590757784152],
          [-122.40125442371931, 37.72407338940798],
          [-122.40652289162597, 37.735199012314865],
        ],
      },
    ],
  },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [teamData, setTeamData] = useState([]);
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

  const getMinMaxInteractions = () => {
    if (data.length === 0) return { min: 0, max: 0 };

    const interactions = data.map((item) => item.Interactions);
    return {
      min: Math.min(...interactions),
      max: Math.max(...interactions),
    };
  };

  const { min, max } = getMinMaxInteractions();

  const getPercentage = (workArea, workZone) => {
    const workZoneInteractions = getInteractions(workArea, workZone);
    const updatedWorkArea = updateWorkAreaName(workArea);
    const filtered = data.filter(
      (item) => item["Work Area"] === updatedWorkArea
    );
    const total = filtered.reduce((sum, item) => sum + item.Interactions, 0);
    const percentage = (workZoneInteractions / total) * 100;
    return percentage.toFixed(2);
  };

  return (
    <div className="page">
      <div className="content">
        <div className="text">
          <div className="heading">
            <h1 className="title">CAP Impact Fiscal Year-to-Date </h1>
            <h3 className="subtitle">
              FY 2024-2025 Total Interactions by Team
            </h3>
          </div>
          <div className="instructions">
            <p style={{ marginTop: "25px" }}>
              {" "}
              Interact with the map by clicking on a team's work zone to find
              out more!
            </p>
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
                total interactions so far!
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
                      <p>{item.Interactions.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="zone-data"
                style={{ position: "relative", display: "inline-block" }}
              >
                <p>{zone} Interaction Distribution Percentage</p>
                <PercentageBar
                  interactionPercentage={getPercentage(area, zone)}
                  color={selectedColor}
                />
              </div>
            </div>
          )}
          <div className="footer">
            <div className="city-text">
              <p>City and County of San Francisco</p>
              <p>Data through 02/28/2025</p>
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
