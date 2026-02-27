// lib/dailyBeach.ts
// API simple y compatible: dailyBeachUrl() (función) + dailyBeachName().

const BEACHES = [
  { name: "Pocitos", url: "/bg/beach_01.jpg" },
  { name: "Copacabana", url: "/bg/beach_02.jpg" },
  { name: "Maldivas", url: "/bg/beach_03.jpg" },
  { name: "Waikiki", url: "/bg/beach_04.jpg" },
  { name: "Tulum", url: "/bg/beach_05.jpg" },
  { name: "Navagio", url: "/bg/beach_06.jpg" },
  { name: "Boracay", url: "/bg/beach_07.jpg" },
  { name: "Maui", url: "/bg/beach_08.jpg" },
  { name: "Cancún", url: "/bg/beach_09.jpg" },
  { name: "Bora Bora", url: "/bg/beach_10.jpg" },
  { name: "Seychelles", url: "/bg/beach_11.jpg" },
  { name: "Capri", url: "/bg/beach_12.jpg" },
  { name: "Santorini", url: "/bg/beach_13.jpg" },
  { name: "Ibiza", url: "/bg/beach_14.jpg" },
  { name: "Fernando de Noronha", url: "/bg/beach_15.jpg" },
  { name: "Angra", url: "/bg/beach_16.jpg" },
  { name: "Punta Cana", url: "/bg/beach_17.jpg" },
  { name: "Búzios", url: "/bg/beach_18.jpg" },
  { name: "Zanzibar", url: "/bg/beach_19.jpg" },
  { name: "Grace Bay", url: "/bg/beach_20.jpg" },
];

function dayIndex(mod: number) {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % mod;
}

export function dailyBeachUrl() {
  return BEACHES[dayIndex(BEACHES.length)].url;
}

export function dailyBeachName() {
  return BEACHES[dayIndex(BEACHES.length)].name;
}

export function getDailyBeachLabel() {
  return `${dailyBeachName()}`;
}
