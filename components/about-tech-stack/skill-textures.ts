import {
  siAndroid,
  siDocker,
  siGit,
  siMqtt,
  siPython,
  siRaspberrypi,
  siReact,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { CanvasTexture, SRGBColorSpace } from "three";

export type Skill = {
  name: string;
  shortName: string;
  accent: string;
  icon?: SimpleIcon;
  symbol?: "azure" | "network" | "security" | "testing" | "iot" | "api";
};

export const TECH_STACK_SKILLS: Skill[] = [
  { name: "TypeScript", shortName: "TS", accent: `#${siTypescript.hex}`, icon: siTypescript },
  { name: "React", shortName: "RE", accent: `#${siReact.hex}`, icon: siReact },
  { name: "Python", shortName: "PY", accent: `#${siPython.hex}`, icon: siPython },
  { name: "Git", shortName: "GIT", accent: `#${siGit.hex}`, icon: siGit },
  { name: "Docker", shortName: "DK", accent: `#${siDocker.hex}`, icon: siDocker },
  { name: "Azure", shortName: "AZ", accent: "#1689d4", symbol: "azure" },
  { name: "Android", shortName: "AN", accent: `#${siAndroid.hex}`, icon: siAndroid },
  { name: "MQTT", shortName: "MQ", accent: `#${siMqtt.hex}`, icon: siMqtt },
  { name: "Raspberry Pi", shortName: "RPI", accent: `#${siRaspberrypi.hex}`, icon: siRaspberrypi },
  { name: "Networking", shortName: "NET", accent: "#4fb6ae", symbol: "network" },
  { name: "Cybersecurity", shortName: "SEC", accent: "#df725f", symbol: "security" },
  { name: "Testing", shortName: "QA", accent: "#d1aa55", symbol: "testing" },
  { name: "IoT", shortName: "IOT", accent: "#56b987", symbol: "iot" },
  { name: "REST APIs", shortName: "API", accent: "#8ba4b1", symbol: "api" },
];

export function createSkillLabelTexture(skill: Skill) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) return new CanvasTexture(canvas);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.arc(256, 256, 226, 0, Math.PI * 2);
  context.fillStyle = "#f5f7f6";
  context.fill();
  context.lineWidth = 16;
  context.strokeStyle = skill.accent;
  context.stroke();

  drawSkillLogo(context, skill);
  drawFittedLabel(context, skill.name.toUpperCase());

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function drawFittedLabel(context: CanvasRenderingContext2D, label: string) {
  let fontSize = 34;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#11191a";

  do {
    context.font = `700 ${fontSize}px Arial, Helvetica, sans-serif`;
    fontSize -= 1;
  } while (context.measureText(label).width > 350 && fontSize > 23);

  context.fillText(label, 256, 378);
}

function drawSkillLogo(context: CanvasRenderingContext2D, skill: Skill) {
  context.save();
  context.fillStyle = skill.accent;
  context.strokeStyle = skill.accent;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (skill.icon) {
    const path = new Path2D(skill.icon.path);
    context.translate(139, 82);
    context.scale(9.75, 9.75);
    context.fill(path);
    context.restore();
    return;
  }

  switch (skill.symbol) {
    case "azure":
      drawAzureLogo(context);
      break;
    case "network":
      drawNetworkLogo(context);
      break;
    case "security":
      drawSecurityLogo(context);
      break;
    case "testing":
      drawTestingLogo(context);
      break;
    case "iot":
      drawIotLogo(context);
      break;
    case "api":
      drawApiLogo(context);
      break;
    default:
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "900 128px Arial, Helvetica, sans-serif";
      context.fillText(skill.shortName, 256, 235);
  }

  context.restore();
}

function drawAzureLogo(context: CanvasRenderingContext2D) {
  context.beginPath();
  context.moveTo(144, 324);
  context.lineTo(226, 108);
  context.lineTo(286, 108);
  context.lineTo(229, 270);
  context.lineTo(350, 270);
  context.lineTo(383, 324);
  context.closePath();
  context.fill();
  context.beginPath();
  context.moveTo(269, 212);
  context.lineTo(316, 108);
  context.lineTo(378, 324);
  context.lineTo(326, 324);
  context.closePath();
  context.fill();
}

function drawNetworkLogo(context: CanvasRenderingContext2D) {
  const nodes = [[256, 122], [146, 236], [366, 236], [256, 326]] as const;
  context.lineWidth = 18;
  context.beginPath();
  context.moveTo(...nodes[0]);
  context.lineTo(...nodes[1]);
  context.lineTo(...nodes[3]);
  context.lineTo(...nodes[2]);
  context.closePath();
  context.moveTo(...nodes[1]);
  context.lineTo(...nodes[2]);
  context.stroke();
  nodes.forEach(([x, y]) => {
    context.beginPath();
    context.arc(x, y, 28, 0, Math.PI * 2);
    context.fill();
  });
}

function drawSecurityLogo(context: CanvasRenderingContext2D) {
  context.beginPath();
  context.moveTo(256, 100);
  context.lineTo(374, 148);
  context.lineTo(357, 272);
  context.quadraticCurveTo(340, 328, 256, 356);
  context.quadraticCurveTo(172, 328, 155, 272);
  context.lineTo(138, 148);
  context.closePath();
  context.fill();
  context.strokeStyle = "#f5f7f6";
  context.lineWidth = 20;
  context.beginPath();
  context.moveTo(201, 230);
  context.lineTo(238, 268);
  context.lineTo(317, 183);
  context.stroke();
}

function drawTestingLogo(context: CanvasRenderingContext2D) {
  context.lineWidth = 22;
  context.strokeRect(146, 116, 220, 220);
  context.beginPath();
  context.moveTo(188, 226);
  context.lineTo(231, 269);
  context.lineTo(325, 172);
  context.stroke();
  context.beginPath();
  context.moveTo(193, 116);
  context.lineTo(193, 88);
  context.moveTo(319, 116);
  context.lineTo(319, 88);
  context.stroke();
}

function drawIotLogo(context: CanvasRenderingContext2D) {
  context.lineWidth = 18;
  context.beginPath();
  context.arc(256, 250, 29, 0, Math.PI * 2);
  context.fill();
  [62, 108, 154].forEach((radius) => {
    context.beginPath();
    context.arc(256, 250, radius, Math.PI * 1.18, Math.PI * 1.82);
    context.stroke();
  });
  context.beginPath();
  context.moveTo(256, 278);
  context.lineTo(256, 334);
  context.stroke();
}

function drawApiLogo(context: CanvasRenderingContext2D) {
  context.lineWidth = 24;
  context.beginPath();
  context.moveTo(214, 122);
  context.lineTo(162, 122);
  context.lineTo(162, 204);
  context.lineTo(122, 246);
  context.lineTo(162, 288);
  context.lineTo(162, 348);
  context.lineTo(214, 348);
  context.moveTo(298, 122);
  context.lineTo(350, 122);
  context.lineTo(350, 204);
  context.lineTo(390, 246);
  context.lineTo(350, 288);
  context.lineTo(350, 348);
  context.lineTo(298, 348);
  context.stroke();
  context.beginPath();
  context.arc(256, 236, 35, 0, Math.PI * 2);
  context.fill();
}
