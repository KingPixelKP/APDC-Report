const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaSatelliteDish,
  FaMicrochip,
  FaNetworkWired,
  FaPlug,
  FaProjectDiagram,
  FaCheckCircle,
  FaCodeBranch,
  FaExclamationTriangle,
  FaFlask,
  FaCogs,
  FaShieldAlt,
  FaRegLightbulb,
  FaTools,
  FaQuestionCircle,
  FaServer,
  FaLayerGroup,
  FaExchangeAlt,
  FaBug,
  FaUsb,
  FaWaveSquare,
} = require("react-icons/fa");

// ---------- palette ----------
const MAROON = "5C0E2E";
const MAROON_DARK = "3D0920";
const CHARCOAL = "242326";
const TEAL = "0FA3A3";
const WHITE = "FFFFFF";
const TEXT_DARK = "2B2730";
const TEXT_MUTED = "6B6570";
const CARD_TINT = "F6EEF0";
const LINE_GREY = "E4DCDF";

const FONT_HEAD = "Cambria";
const FONT_BODY = "Calibri";

function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) }),
  );
}
async function iconPng(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function main() {
  let pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
  pres.author = "Gabriel Matias Falcão";
  pres.title = "Internship Defense — SDR Control & RS-232 Interface (GMV)";

  const W = 13.333,
    H = 7.5;

  // pre-render icons
  const icons = {};
  const want = [
    ["satellite", FaSatelliteDish, WHITE],
    ["satelliteM", FaSatelliteDish, MAROON],
    ["chip", FaMicrochip, MAROON],
    ["net", FaNetworkWired, MAROON],
    ["plug", FaPlug, MAROON],
    ["diagram", FaProjectDiagram, WHITE],
    ["check", FaCheckCircle, TEAL],
    ["branch", FaCodeBranch, MAROON],
    ["warn", FaExclamationTriangle, MAROON],
    ["flask", FaFlask, MAROON],
    ["cogs", FaCogs, MAROON],
    ["shield", FaShieldAlt, MAROON],
    ["bulb", FaRegLightbulb, WHITE],
    ["tools", FaTools, MAROON],
    ["question", FaQuestionCircle, WHITE],
    ["server", FaServer, MAROON],
    ["layers", FaLayerGroup, MAROON],
    ["exchange", FaExchangeAlt, MAROON],
    ["bug", FaBug, MAROON],
    ["usb", FaUsb, MAROON],
    ["wave", FaWaveSquare, WHITE],
    ["waveM", FaWaveSquare, MAROON],
  ];
  for (const [key, comp, color] of want)
    icons[key] = await iconPng(comp, color, 256);

  // helper: icon in colored circle
  function iconCircle(slide, iconKey, x, y, d, circleColor, iconScale = 0.55) {
    slide.addShape(pres.shapes.OVAL, {
      x,
      y,
      w: d,
      h: d,
      fill: { color: circleColor },
    });
    const isz = d * iconScale;
    slide.addImage({
      data: icons[iconKey],
      x: x + (d - isz) / 2,
      y: y + (d - isz) / 2,
      w: isz,
      h: isz,
    });
  }

  let slideNumber = 1;
  function footer(slide) {
    slide.addText(`${slideNumber}`, {
      x: W - 0.7,
      y: H - 0.45,
      w: 0.5,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 10,
      color: TEXT_MUTED,
      align: "right",
    });
    slide.addText("GMV — SDR Control & RS-232 Interface", {
      x: 0.5,
      y: H - 0.45,
      w: 5,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 10,
      color: TEXT_MUTED,
      align: "left",
    });
  }

  function titleBlock(slide, kicker, title, opts = {}) {
    const dark = !!opts.dark;
    if (kicker) {
      slide.addText(kicker.toUpperCase(), {
        x: 0.6,
        y: 0.45,
        w: 10,
        h: 0.35,
        fontFace: FONT_BODY,
        fontSize: 13,
        bold: true,
        color: dark ? TEAL : MAROON,
        charSpacing: 2,
      });
    }
    slide.addText(title, {
      x: 0.6,
      y: kicker ? 0.78 : 0.5,
      w: 11.5,
      h: 0.9,
      fontFace: FONT_HEAD,
      fontSize: 32,
      bold: true,
      color: dark ? WHITE : TEXT_DARK,
      margin: 0,
    });
  }

  // ================= SLIDE 1 — TITLE =================
  {
    let s = pres.addSlide();
    s.background = { color: MAROON_DARK };
    // subtle dot motif top-right, echoing the report cover
    for (let i = 0; i < 6; i++) {
      s.addShape(pres.shapes.OVAL, {
        x: W - 1.6 + i * 0.0,
        y: 0.3 + i * 0.0,
        w: 0.02,
        h: 0.02,
      }); // placeholder no-op avoided
    }
    iconCircle(s, "satellite", 0.9, 0.9, 1.3, MAROON, 0.55);
    s.addText("CURRICULAR DEVELOPMENT ACTIVITY", {
      x: 0.6,
      y: 2.7,
      w: 10,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 14,
      bold: true,
      color: TEAL,
      charSpacing: 3,
    });
    s.addText(
      "Programmatic Control of SDR Hardware\nfor GNSS Signal Transmission",
      {
        x: 0.6,
        y: 3.1,
        w: 11.5,
        h: 1.7,
        fontFace: FONT_HEAD,
        fontSize: 38,
        bold: true,
        color: WHITE,
        margin: 0,
        lineSpacingMultiple: 1.05,
      },
    );
    s.addText(
      [
        {
          text: "Gabriel Matias Falcão",
          options: { bold: true, breakLine: true },
        },
        {
          text: "Bachelor in Computer Science — NOVA FCT  |  Internship at GMV",
          options: {},
        },
      ],
      {
        x: 0.6,
        y: 5.2,
        w: 10,
        h: 0.8,
        fontFace: FONT_BODY,
        fontSize: 16,
        color: "D8C7CF",
      },
    );
    s.addText("March 11 — July 17, 2026", {
      x: 0.6,
      y: 6.7,
      w: 6,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: "B79AA6",
    });
  }

  // ================= SLIDE 2 — CONTEXT =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(s, "Context", "Why GNSS signal simulation matters");

    const items = [
      [
        "satelliteM",
        "GNSS constellations",
        "GPS, Galileo, GLONASS, BeiDou — satellites broadcasting positioning signals to receivers worldwide.",
      ],
      [
        "flask",
        "Signal simulators",
        "Reproduce satellite signals on the ground, enabling controlled, repeatable receiver testing without waiting on real satellites.",
      ],
      [
        "waveM",
        "SDR as the transmission layer",
        "Pre-computed I/Q samples are streamed through Software-Defined Radio hardware to produce realistic RF signals.",
      ],
    ];
    let x = 0.7,
      gap = 0.4,
      cw = (W - 1.4 - gap * 2) / 3;
    items.forEach(([icon, h, body], i) => {
      const cx = x + i * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx,
        y: 1.9,
        w: cw,
        h: 4.4,
        rectRadius: 0.08,
        fill: { color: CARD_TINT },
        shadow: {
          type: "outer",
          color: "000000",
          blur: 8,
          offset: 3,
          angle: 90,
          opacity: 0.08,
        },
      });
      iconCircle(s, icon, cx + 0.4, 2.3, 0.9, WHITE, 0.55);
      s.addText(h, {
        x: cx + 0.35,
        y: 3.35,
        w: cw - 0.7,
        h: 0.7,
        fontFace: FONT_HEAD,
        fontSize: 17,
        bold: true,
        color: TEXT_DARK,
        margin: 0,
      });
      s.addText(body, {
        x: cx + 0.35,
        y: 4.0,
        w: cw - 0.7,
        h: 2.1,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        color: TEXT_MUTED,
        margin: 0,
        lineSpacingMultiple: 1.2,
      });
    });
    footer(s);
  }

  // ================= SLIDE 3 — PROBLEM =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(s, "Problem", "A gap between hardware and high-level intent");

    const rows = [
      [
        "chip",
        "DTAPI is low-level",
        "Configuring DekTec SDR hardware requires precise call sequencing, manual state management, and direct handling of FIFO/DMA details.",
      ],
      [
        "exchange",
        "No bridge to open-source tools",
        "No existing solution connects open-source GNSS I/Q generators to professional-grade SDR hardware.",
      ],
      [
        "usb",
        "RS-232 has no standard protocol",
        "Framing, message structure and field encoding are entirely bespoke — every integration reinvents the same byte-level logic.",
      ],
    ];
    let y = 2.0;
    rows.forEach(([icon, h, body]) => {
      iconCircle(s, icon, 0.7, y, 0.75, CARD_TINT, 0.55);
      s.addText(h, {
        x: 1.7,
        y: y - 0.05,
        w: 4.0,
        h: 0.8,
        fontFace: FONT_HEAD,
        fontSize: 17,
        bold: true,
        color: TEXT_DARK,
        margin: 0,
        valign: "top",
      });
      s.addText(body, {
        x: 5.9,
        y: y - 0.05,
        w: 6.6,
        h: 0.85,
        fontFace: FONT_BODY,
        fontSize: 13.5,
        color: TEXT_MUTED,
        margin: 0,
        valign: "top",
        lineSpacingMultiple: 1.2,
      });
      y += 1.55;
    });
    footer(s);
  }

  // ================= SLIDE 4 — OBJECTIVES / PROPOSED WORK =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(
      s,
      "Proposed Work",
      "Three phases, one goal: programmatic control",
    );

    const phases = [
      [
        "server",
        "Phase 1",
        "SDR Control",
        "C++ abstraction over the DTAPI for device management, signal transmission and synchronisation.",
      ],
      [
        "cogs",
        "Phase 2",
        "Parameter Management",
        "A configuration system to manage SDR transmission parameters without low-level API calls.",
      ],
      [
        "plug",
        "Phase 3",
        "RS-232 Communication",
        "A serial communication layer for exchanging commands and data with external equipment.",
      ],
    ];
    let x = 0.7,
      gap = 0.4,
      cw = (W - 1.4 - gap * 2) / 3;
    phases.forEach(([icon, tag, h, body], i) => {
      const cx = x + i * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx,
        y: 1.9,
        w: cw,
        h: 4.3,
        rectRadius: 0.08,
        fill: { color: i === 0 ? MAROON : CARD_TINT },
      });
      iconCircle(
        s,
        icon,
        cx + 0.4,
        2.3,
        0.85,
        i === 0 ? "FFFFFF" : WHITE,
        0.55,
      );
      // fix circle color issue: use white circle bg with maroon icon regardless
      s.addText(tag, {
        x: cx + 0.35,
        y: 3.3,
        w: cw - 0.7,
        h: 0.35,
        fontFace: FONT_BODY,
        fontSize: 11.5,
        bold: true,
        color: i === 0 ? TEAL : MAROON,
        margin: 0,
        charSpacing: 1,
      });
      s.addText(h, {
        x: cx + 0.35,
        y: 3.65,
        w: cw - 0.7,
        h: 0.6,
        fontFace: FONT_HEAD,
        fontSize: 18,
        bold: true,
        color: i === 0 ? WHITE : TEXT_DARK,
        margin: 0,
      });
      s.addText(body, {
        x: cx + 0.35,
        y: 4.3,
        w: cw - 0.7,
        h: 1.8,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        color: i === 0 ? "EBD9DF" : TEXT_MUTED,
        margin: 0,
        lineSpacingMultiple: 1.2,
      });
    });
    footer(s);
  }

  // ================= SLIDE 5 — SCOPE EVOLUTION =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(s, "Scope Evolution", "Requirements rarely stay fixed");

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7,
      y: 2.1,
      w: 5.7,
      h: 3.9,
      rectRadius: 0.08,
      fill: { color: CARD_TINT },
    });
    iconCircle(s, "warn", 1.1, 2.5, 0.8, WHITE, 0.55);
    s.addText("Protocol misnomer", {
      x: 1.1,
      y: 3.45,
      w: 4.9,
      h: 0.5,
      fontFace: FONT_HEAD,
      fontSize: 17,
      bold: true,
      color: TEXT_DARK,
      margin: 0,
    });
    s.addText(
      "Original proposal referred to RS-485; the external equipment actually used RS-232 from the outset. Identified early, before protocol-specific work began — no design impact.",
      {
        x: 1.1,
        y: 4.0,
        w: 4.9,
        h: 1.9,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: TEXT_MUTED,
        margin: 0,
        lineSpacingMultiple: 1.25,
      },
    );

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.9,
      y: 2.1,
      w: 5.7,
      h: 3.9,
      rectRadius: 0.08,
      fill: { color: MAROON },
    });
    iconCircle(s, "branch", 7.3, 2.5, 0.8, WHITE, 0.55);
    s.addText("Unplanned integration", {
      x: 7.3,
      y: 3.45,
      w: 4.9,
      h: 0.5,
      fontFace: FONT_HEAD,
      fontSize: 17,
      bold: true,
      color: WHITE,
      margin: 0,
    });
    s.addText(
      "As components matured, integration with existing proprietary GMV systems became necessary — not part of the original scope, and the most effort-intensive change to the plan.",
      {
        x: 7.3,
        y: 4.0,
        w: 4.9,
        h: 1.9,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: "EBD9DF",
        margin: 0,
        lineSpacingMultiple: 1.25,
      },
    );
    footer(s);
  }

  // ================= SLIDE 6 — SDR ARCHITECTURE DIAGRAM =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(s, "SDR Control System", "Client-server architecture over gRPC");

    // boxes
    function box(x, y, w, h, label, sub, fill, textColor) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w,
        h,
        rectRadius: 0.06,
        fill: { color: fill },
        line: { color: LINE_GREY, width: 1 },
      });
      s.addText(label, {
        x: x + 0.1,
        y: y + 0.08,
        w: w - 0.2,
        h: 0.35,
        fontFace: FONT_BODY,
        fontSize: 12,
        bold: true,
        color: textColor,
        margin: 0,
        align: "center",
      });
      if (sub)
        s.addText(sub, {
          x: x + 0.1,
          y: y + h - 0.38,
          w: w - 0.2,
          h: 0.32,
          fontFace: FONT_BODY,
          fontSize: 9,
          color: textColor,
          margin: 0,
          align: "center",
        });
    }
    function arrow(x1, y1, x2, y2) {
      s.addShape(pres.shapes.LINE, {
        x: x1,
        y: y1,
        w: x2 - x1,
        h: y2 - y1,
        line: { color: TEXT_MUTED, width: 1.5, endArrowType: "triangle" },
      });
    }

    const baseY = 2.1;
    box(
      0.7,
      baseY,
      2.0,
      0.9,
      "CLI Client",
      "user-facing",
      CARD_TINT,
      TEXT_DARK,
    );
    box(3.4, baseY, 2.0, 0.9, "Server", "gRPC", MAROON, WHITE);
    box(
      6.1,
      baseY,
      2.4,
      0.9,
      "app + dt_facade",
      "DTAPI wrapper",
      CARD_TINT,
      TEXT_DARK,
    );
    box(9.2, baseY, 1.6, 0.9, "DTAPI", "vendor SDK", CARD_TINT, TEXT_DARK);
    box(
      11.1,
      baseY,
      1.6,
      0.9,
      "DTA-2115B /\nDTA-2116",
      "PCIe cards",
      TEAL,
      WHITE,
    );

    arrow(2.7, baseY + 0.45, 3.4, baseY + 0.45);
    arrow(5.4, baseY + 0.45, 6.1, baseY + 0.45);
    arrow(8.5, baseY + 0.45, 9.2, baseY + 0.45);
    arrow(10.8, baseY + 0.45, 11.1, baseY + 0.45);

    s.addText(
      ".proto contract — stub & skeleton autogenerated by protoc from the same source",
      {
        x: 3.2,
        y: baseY + 1.05,
        w: 4.0,
        h: 0.6,
        fontFace: FONT_BODY,
        fontSize: 10,
        italic: true,
        color: TEXT_MUTED,
        margin: 0,
      },
    );

    // why gRPC card
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7,
      y: 4.0,
      w: 11.9,
      h: 2.2,
      rectRadius: 0.08,
      fill: { color: CARD_TINT },
    });
    s.addText("Why gRPC?", {
      x: 1.0,
      y: 4.2,
      w: 4,
      h: 0.4,
      fontFace: FONT_HEAD,
      fontSize: 15,
      bold: true,
      color: MAROON,
      margin: 0,
    });
    s.addText(
      [
        {
          text: "Reliability & performance — proven in production systems",
          options: { bullet: true, breakLine: true },
        },
        {
          text: "Strongly-typed contract between server and client",
          options: { bullet: true, breakLine: true },
        },
        {
          text: "Reflection — debugging, config parsing, command discovery for free",
          options: { bullet: true },
        },
      ],
      {
        x: 1.0,
        y: 4.65,
        w: 11.3,
        h: 1.4,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: TEXT_DARK,
        margin: 0,
        lineSpacingMultiple: 1.3,
      },
    );
    footer(s);
  }

  // ================= SLIDE 7 — DESIGN DECISIONS =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(
      s,
      "Design Decisions",
      "Consistent principles across both systems",
    );

    const decisions = [
      [
        "shield",
        "Errors as values",
        "std::expected<T,E> instead of exceptions or C-style codes — explicit, compile-time checked error handling.",
      ],
      [
        "tools",
        "XMake build system",
        "More concise configuration, simpler package management, and faster cached builds than CMake/Ninja.",
      ],
      [
        "layers",
        "Boost.PFR serialisation",
        "Automatic struct reflection for serialisation — no manual parsing boilerplate, no annotation macros.",
      ],
    ];
    let x = 0.7,
      gap = 0.4,
      cw = (W - 1.4 - gap * 2) / 3;
    decisions.forEach(([icon, h, body], i) => {
      const cx = x + i * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx,
        y: 2.0,
        w: cw,
        h: 4.3,
        rectRadius: 0.08,
        fill: { color: CARD_TINT },
        shadow: {
          type: "outer",
          color: "000000",
          blur: 8,
          offset: 3,
          angle: 90,
          opacity: 0.08,
        },
      });
      iconCircle(s, icon, cx + 0.4, 2.4, 0.85, WHITE, 0.55);
      s.addText(h, {
        x: cx + 0.35,
        y: 3.45,
        w: cw - 0.7,
        h: 0.7,
        fontFace: FONT_HEAD,
        fontSize: 16,
        bold: true,
        color: TEXT_DARK,
        margin: 0,
      });
      s.addText(body, {
        x: cx + 0.35,
        y: 4.1,
        w: cw - 0.7,
        h: 2.0,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        color: TEXT_MUTED,
        margin: 0,
        lineSpacingMultiple: 1.25,
      });
    });
    footer(s);
  }

  // ================= SLIDE 8 - SDR CONTROL DEMO =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(
      s,
      "SDR Control Demo",
      "Live demonstration of the SDR control system",
    );

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7,
      y: 2.0,
      w: 11.9,
      h: 4.3,
      rectRadius: 0.08,
      fill: { color: CARD_TINT },
    });1
    footer(s);
  }

  // ================= SLIDE 8 — RS-232 INTERFACE =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(
      s,
      "RS-232 Interface",
      "Protocol registration over a serial link",
    );

    function node(x, y, w, h, label, fill, tcolor) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w,
        h,
        rectRadius: 0.06,
        fill: { color: fill },
        line: { color: LINE_GREY, width: 1 },
      });
      s.addText(label, {
        x,
        y,
        w,
        h,
        fontFace: FONT_BODY,
        fontSize: 12,
        bold: true,
        color: tcolor,
        align: "center",
        valign: "middle",
        margin: 0,
      });
    }
    function arrow(x1, y1, x2, y2) {
      s.addShape(pres.shapes.LINE, {
        x: x1,
        y: y1,
        w: x2 - x1,
        h: y2 - y1,
        line: { color: TEXT_MUTED, width: 1.5, endArrowType: "triangle" },
      });
    }

    node(0.7, 2.2, 2.6, 0.8, "Registry", CARD_TINT, TEXT_DARK);
    node(0.7, 3.6, 2.6, 0.8, "Reader", MAROON, WHITE);
    node(0.7, 5.0, 2.6, 0.8, "Writer", MAROON, WHITE);
    node(4.4, 3.6, 2.8, 0.8, "Serializer\n(Boost.PFR)", CARD_TINT, TEXT_DARK);
    node(4.4, 5.0, 2.8, 0.8, "COBS Encoder /\nDecoder", CARD_TINT, TEXT_DARK);

    arrow(2.0, 3.0, 2.0, 3.6);
    arrow(2.0, 4.4, 2.0, 5.0);
    
    arrow(3.3, 4.0, 4.4, 4.0);
    arrow(3.3, 4.0, 4.4, 5.4);

    arrow(3.3, 5.4, 4.4, 4.0);
    arrow(3.3, 5.4, 4.4, 5.4);

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 8.1,
      y: 2.2,
      w: 4.5,
      h: 3.6,
      rectRadius: 0.08,
      fill: { color: CARD_TINT },
    });
    s.addText("Core ideas", {
      x: 8.4,
      y: 2.4,
      w: 4,
      h: 0.4,
      fontFace: FONT_HEAD,
      fontSize: 15,
      bold: true,
      color: MAROON,
      margin: 0,
    });
    s.addText(
      [
        {
          text: "Declare a C++ struct → register a handler, no core changes needed",
          options: { bullet: true, breakLine: true },
        },
        {
          text: "Boost.PFR auto-derives memory layout for serialisation",
          options: { bullet: true, breakLine: true },
        },
        {
          text: "COBS framing for reliable packet delimitation",
          options: { bullet: true, breakLine: true },
        },
        {
          text: "Lightweight — no gRPC-level overhead on a serial link",
          options: { bullet: true },
        },
      ],
      {
        x: 8.4,
        y: 2.9,
        w: 4.0,
        h: 2.8,
        fontFace: FONT_BODY,
        fontSize: 12,
        color: TEXT_DARK,
        margin: 0,
        lineSpacingMultiple: 1.25,
      },
    );
    footer(s);
  }

  // ================= SLIDE 9 — THREE ITERATIONS =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(s, "Three Iterations", "Learning by narrowing the scope");

    const iters = [
      [
        "v1",
        "Reuse third-party program",
        "Abandoned — assumptions about threading and API extensibility didn't fit this use case.",
        CARD_TINT,
        TEXT_DARK,
        MAROON,
      ],
      [
        "v2",
        "Fully general rewrite",
        "Abandoned — supported modulation types were never required; generality cost more than it gave.",
        CARD_TINT,
        TEXT_DARK,
        MAROON,
      ],
      [
        "v3",
        "Scoped to DTA-2115B/2116",
        "Adopted — narrowing to actual requirements made the system simpler to implement, test and reason about.",
        MAROON,
        WHITE,
        TEAL,
      ],
    ];
    let x = 0.7,
      gap = 0.4,
      cw = (W - 1.4 - gap * 2) / 3;
    iters.forEach(([tag, h, body, fill, tcolor, tagColor], i) => {
      const cx = x + i * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx,
        y: 2.0,
        w: cw,
        h: 4.3,
        rectRadius: 0.08,
        fill: { color: fill },
      });
      s.addText(tag, {
        x: cx + 0.35,
        y: 2.25,
        w: cw - 0.7,
        h: 0.6,
        fontFace: FONT_HEAD,
        fontSize: 26,
        bold: true,
        color: tagColor,
        margin: 0,
      });
      s.addText(h, {
        x: cx + 0.35,
        y: 2.95,
        w: cw - 0.7,
        h: 0.8,
        fontFace: FONT_HEAD,
        fontSize: 16,
        bold: true,
        color: tcolor,
        margin: 0,
      });
      s.addText(body, {
        x: cx + 0.35,
        y: 3.75,
        w: cw - 0.7,
        h: 2.3,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        color: i === 2 ? "EBD9DF" : TEXT_MUTED,
        margin: 0,
        lineSpacingMultiple: 1.25,
      });
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: cx + cw + 0.04,
          y: 4.1,
          w: 0.32,
          h: 0,
          line: { color: TEXT_MUTED, width: 1.5, endArrowType: "triangle" },
        });
      }
    });
    footer(s);
  }

  // ================= SLIDE 10 — INTEGRATION & TESTING =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(s, "Integration & Testing", "Validated against real hardware");

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7,
      y: 2.0,
      w: 5.6,
      h: 4.3,
      rectRadius: 0.08,
      fill: { color: CARD_TINT },
    });
    iconCircle(s, "flask", 1.05, 2.3, 0.75, WHITE, 0.55);
    s.addText("External tester", {
      x: 1.95,
      y: 2.4,
      w: 4.2,
      h: 0.5,
      fontFace: FONT_HEAD,
      fontSize: 16,
      bold: true,
      color: TEXT_DARK,
      margin: 0,
    });
    s.addText(
      "Simulates the remote receiver over RS-232, exercising both systems end-to-end without needing full deployment hardware.",
      {
        x: 1.05,
        y: 3.2,
        w: 5.0,
        h: 1.1,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        color: TEXT_MUTED,
        margin: 0,
        lineSpacingMultiple: 1.25,
      },
    );

    const tests = [
      "Test 1 — Power configuration (Rohde & Schwarz NRQ6)",
      "Test 2 — Frequency configuration (frequency counter)",
      "Test 3 — Signal recording (Ettus USRP X310)",
    ];
    let ty = 4.4;
    tests.forEach((t) => {
      s.addShape(pres.shapes.OVAL, {
        x: 1.05,
        y: ty + 0.06,
        w: 0.12,
        h: 0.12,
        fill: { color: TEAL },
      });
      s.addText(t, {
        x: 1.3,
        y: ty - 0.1,
        w: 4.8,
        h: 0.4,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        color: TEXT_DARK,
        margin: 0,
      });
      ty += 0.55;
    });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.6,
      y: 2.0,
      w: 6.0,
      h: 4.3,
      rectRadius: 0.08,
      fill: { color: MAROON },
    });
    iconCircle(s, "exchange", 6.95, 2.3, 0.75, WHITE, 0.55);
    s.addText("A finding worth noting", {
      x: 7.85,
      y: 2.4,
      w: 4.6,
      h: 0.5,
      fontFace: FONT_HEAD,
      fontSize: 16,
      bold: true,
      color: WHITE,
      margin: 0,
    });
    s.addText(
      "During integration with GMV's proprietary systems, the gRPC client-server boundary was not exercised — the proprietary system links the app component directly, in-process.",
      {
        x: 6.95,
        y: 3.2,
        w: 5.4,
        h: 1.4,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: "EBD9DF",
        margin: 0,
        lineSpacingMultiple: 1.3,
      },
    );
    s.addText(
      "The gRPC layer remains functional and independently testable through the CLI client — it just wasn't the path this particular integration needed.",
      {
        x: 6.95,
        y: 4.8,
        w: 5.4,
        h: 1.3,
        fontFace: FONT_BODY,
        fontSize: 12.5,
        italic: true,
        color: "D8C7CF",
        margin: 0,
        lineSpacingMultiple: 1.3,
      },
    );
    footer(s);
  }

  // ================= SLIDE 11 — TECHNICAL CHALLENGES =================
  {
    let s = pres.addSlide();
    s.background = { color: WHITE };
    titleBlock(s, "Challenges Faced", "Where the hard problems actually were");

    const ch = [
      [
        "bug",
        "COBS off-by-one",
        "An output buffer sizing error and an incorrect pop_back() in the decode path — only manifesting at specific payload lengths.",
      ],
      [
        "usb",
        "Serial driver & wiring",
        "Generic 8250 driver was insufficient for the WCH CH382 card; replaced with the vendor driver. A missing null-modem adapter caused two DTE devices to transmit into each other's TX line.",
      ],
    ];
    let x = 0.7,
      gap = 0.5,
      cw = (W - 1.4 - gap) / 2;
    ch.forEach(([icon, h, body], i) => {
      const cx = x + i * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx,
        y: 2.1,
        w: cw,
        h: 4.0,
        rectRadius: 0.08,
        fill: { color: CARD_TINT },
      });
      iconCircle(s, icon, cx + 0.4, 2.5, 0.85, WHITE, 0.55);
      s.addText(h, {
        x: cx + 0.35,
        y: 3.55,
        w: cw - 0.7,
        h: 0.6,
        fontFace: FONT_HEAD,
        fontSize: 18,
        bold: true,
        color: TEXT_DARK,
        margin: 0,
      });
      s.addText(body, {
        x: cx + 0.35,
        y: 4.2,
        w: cw - 0.7,
        h: 1.7,
        fontFace: FONT_BODY,
        fontSize: 13,
        color: TEXT_MUTED,
        margin: 0,
        lineSpacingMultiple: 1.3,
      });
    });
    footer(s);
  }

  // ================= SLIDE 12 — CONCLUSION =================
  {
    let s = pres.addSlide();
    s.background = { color: MAROON_DARK };
    titleBlock(
      s,
      "Conclusion",
      "Two systems, one consistent engineering approach",
      { dark: true },
    );

    const sums = [
      [
        "check",
        "SDR Control System — a clean, remotely accessible, gRPC-based abstraction over the DTAPI.",
      ],
      [
        "check",
        "RS-232 Interface — a lightweight, extensible protocol layer using Boost.PFR and COBS.",
      ],
      [
        "bulb",
        "Lesson: extensibility paid off for external, unpredictable change — but generality pursued ahead of need had a real cost.",
      ],
    ];
    let y = 2.3;
    sums.forEach(([icon, t]) => {
      iconCircle(s, icon, 0.7, y, 0.6, MAROON, 0.55);
      s.addText(t, {
        x: 1.55,
        y: y - 0.02,
        w: 10.8,
        h: 0.9,
        fontFace: FONT_BODY,
        fontSize: 15,
        color: WHITE,
        margin: 0,
        valign: "middle",
        lineSpacingMultiple: 1.25,
      });
      y += 1.25;
    });
    footer(s);
  }

  // ================= SLIDE 13 — QUESTIONS =================
  {
    let s = pres.addSlide();
    s.background = { color: MAROON_DARK };
    iconCircle(s, "question", W / 2 - 0.75, 2.2, 1.5, MAROON, 0.5);
    s.addText("Thank you", {
      x: 0,
      y: 4.0,
      w: W,
      h: 0.9,
      fontFace: FONT_HEAD,
      fontSize: 36,
      bold: true,
      color: WHITE,
      align: "center",
      margin: 0,
    });
    s.addText("Questions & Discussion", {
      x: 0,
      y: 4.8,
      w: W,
      h: 0.5,
      fontFace: FONT_BODY,
      fontSize: 16,
      color: TEAL,
      align: "center",
      margin: 0,
    });
  }

  pres.writeFile({ fileName: "Internship_Defense.pptx" }).then(() => {
    console.log("done");
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
