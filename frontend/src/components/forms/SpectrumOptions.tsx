export enum SourceType {
  Point = "point",
  Extended = "extended",
  Galaxy = "galaxy",
}

export const SpectrumOptions = [
  // Any source type is valid
  { spectralValue: "", spectralName: "", sourceType: "general" }, // user uploads own spectrum
  { spectralValue: "blackbody", spectralName: "Blackbody", sourceType: "general" },
  { spectralValue: "powerLaw", spectralName: "Power-Law", sourceType: "general" },
  { spectralValue: "uniform", spectralName: "Uniform", sourceType: "general" },

  // Galaxy spectra
  {
    spectralValue: "elliptical",
    spectralName: "Elliptical",
    sourceType: SourceType.Galaxy,
  },
  { spectralValue: "spiral", spectralName: "Spiral", sourceType: SourceType.Galaxy },

  // Pickles (star) spectra. A pain in the butt to implement...
  { spectralValue: "o5v", spectralName: "O5 V", sourceType: SourceType.Point },
  { spectralValue: "o9v", spectralName: "O9 V", sourceType: SourceType.Point },
  { spectralValue: "b0v", spectralName: "B0 V", sourceType: SourceType.Point },
  { spectralValue: "b1v", spectralName: "B1 V", sourceType: SourceType.Point },
  { spectralValue: "b3v", spectralName: "B3 V", sourceType: SourceType.Point },
  { spectralValue: "b57v", spectralName: "B5-7 V", sourceType: SourceType.Point },
  { spectralValue: "b8v", spectralName: "B8 V", sourceType: SourceType.Point },
  { spectralValue: "b9v", spectralName: "B9 V", sourceType: SourceType.Point },
  { spectralValue: "a0v", spectralName: "A0 V", sourceType: SourceType.Point },
  { spectralValue: "a2v", spectralName: "A2 V", sourceType: SourceType.Point },
  { spectralValue: "a3v", spectralName: "A3 V", sourceType: SourceType.Point },
  { spectralValue: "a5v", spectralName: "A5 V", sourceType: SourceType.Point },
  { spectralValue: "a7v", spectralName: "A7 V", sourceType: SourceType.Point },
  { spectralValue: "f0v", spectralName: "F0 V", sourceType: SourceType.Point },
  { spectralValue: "f2v", spectralName: "F2 V", sourceType: SourceType.Point },
  { spectralValue: "f5v", spectralName: "F5 V", sourceType: SourceType.Point },
  {
    spectralValue: "wf5v",
    spectralName: "F5 V (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "f6v", spectralName: "F6 V", sourceType: SourceType.Point },
  {
    spectralValue: "rf6v",
    spectralName: "F6 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "f8v", spectralName: "F8 V", sourceType: SourceType.Point },
  {
    spectralValue: "wf8v",
    spectralName: "F8 V (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rf8v",
    spectralName: "F8 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "g0v", spectralName: "G0 V", sourceType: SourceType.Point },
  {
    spectralValue: "wg0v",
    spectralName: "G0 V (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rg0v",
    spectralName: "G0 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "g2v", spectralName: "G2 V", sourceType: SourceType.Point },
  { spectralValue: "g5v", spectralName: "G5 V", sourceType: SourceType.Point },
  {
    spectralValue: "wg5v",
    spectralName: "G5 V (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rg5v",
    spectralName: "G5 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "g8v", spectralName: "G8 V", sourceType: SourceType.Point },
  { spectralValue: "k0v", spectralName: "K0 V", sourceType: SourceType.Point },
  {
    spectralValue: "rk0v",
    spectralName: "K0 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "k2v", spectralName: "K2 V", sourceType: SourceType.Point },
  { spectralValue: "k3v", spectralName: "K3 V", sourceType: SourceType.Point },
  { spectralValue: "k4v", spectralName: "K4 V", sourceType: SourceType.Point },
  { spectralValue: "k5v", spectralName: "K5 V", sourceType: SourceType.Point },
  { spectralValue: "k7v", spectralName: "K7 V", sourceType: SourceType.Point },
  { spectralValue: "m0v", spectralName: "M0 V", sourceType: SourceType.Point },
  { spectralValue: "m1v", spectralName: "M1 V", sourceType: SourceType.Point },
  { spectralValue: "m2v", spectralName: "M2 V", sourceType: SourceType.Point },
  { spectralValue: "m2p5v", spectralName: "M2.5 V", sourceType: SourceType.Point },
  { spectralValue: "m3v", spectralName: "M3 V", sourceType: SourceType.Point },
  { spectralValue: "m4v", spectralName: "M4 V", sourceType: SourceType.Point },
  { spectralValue: "m5v", spectralName: "M5 V", sourceType: SourceType.Point },
  { spectralValue: "m6v", spectralName: "M6 V", sourceType: SourceType.Point },
  { spectralValue: "b2iv", spectralName: "B2 IV", sourceType: SourceType.Point },
  { spectralValue: "b6iv", spectralName: "B6 IV", sourceType: SourceType.Point },
  { spectralValue: "a0iv", spectralName: "A0 IV", sourceType: SourceType.Point },
  { spectralValue: "a47iv", spectralName: "A4-7 IV", sourceType: SourceType.Point },
  { spectralValue: "f02iv", spectralName: "F0-2 IV", sourceType: SourceType.Point },
  { spectralValue: "f5iv", spectralName: "F5 IV", sourceType: SourceType.Point },
  { spectralValue: "f8iv", spectralName: "F8 IV", sourceType: SourceType.Point },
  { spectralValue: "g0iv", spectralName: "G0 IV", sourceType: SourceType.Point },
  { spectralValue: "g2iv", spectralName: "G2 IV", sourceType: SourceType.Point },
  { spectralValue: "g5iv", spectralName: "G5 IV", sourceType: SourceType.Point },
  { spectralValue: "g8iv", spectralName: "G8 IV", sourceType: SourceType.Point },
  { spectralValue: "k0iv", spectralName: "K0 IV", sourceType: SourceType.Point },
  { spectralValue: "k1iv", spectralName: "K1 IV", sourceType: SourceType.Point },
  { spectralValue: "k3iv", spectralName: "K3 IV", sourceType: SourceType.Point },
  { spectralValue: "o8iii", spectralName: "O8 III", sourceType: SourceType.Point },
  { spectralValue: "b12iii", spectralName: "B1-2 ", sourceType: SourceType.Point },
  { spectralValue: "b3iii", spectralName: "B3 III", sourceType: SourceType.Point },
  { spectralValue: "b5iii", spectralName: "B5 III", sourceType: SourceType.Point },
  { spectralValue: "b9iii", spectralName: "B9 III", sourceType: SourceType.Point },
  { spectralValue: "a0iii", spectralName: "A0 III", sourceType: SourceType.Point },
  { spectralValue: "a3iii", spectralName: "A3 III", sourceType: SourceType.Point },
  { spectralValue: "a5iii", spectralName: "A5 III", sourceType: SourceType.Point },
  { spectralValue: "a7iii", spectralName: "A7 III", sourceType: SourceType.Point },
  { spectralValue: "f0iii", spectralName: "F0 III", sourceType: SourceType.Point },
  { spectralValue: "f2iii", spectralName: "F2 III", sourceType: SourceType.Point },
  { spectralValue: "f5iii", spectralName: "F5 III", sourceType: SourceType.Point },
  { spectralValue: "g0iii", spectralName: "G0 III", sourceType: SourceType.Point },
  { spectralValue: "g5iii", spectralName: "G5 III", sourceType: SourceType.Point },
  {
    spectralValue: "wg5iii",
    spectralName: "G5 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rg5iii",
    spectralName: "G5 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "g8iii", spectralName: "G8 III", sourceType: SourceType.Point },
  {
    spectralValue: "wg8iii",
    spectralName: "G8 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "k0iii", spectralName: "K0 III", sourceType: SourceType.Point },
  {
    spectralValue: "wk0iii",
    spectralName: "K0 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rk0iii",
    spectralName: "K0 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "k1iii", spectralName: "K1 III", sourceType: SourceType.Point },
  {
    spectralValue: "wk1iii",
    spectralName: "K1 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rk1iii",
    spectralName: "K1 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "k2iii", spectralName: "K2 III", sourceType: SourceType.Point },
  {
    spectralValue: "wk2iii",
    spectralName: "K2 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rk2iii",
    spectralName: "K2 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "k3iii", spectralName: "K3 III", sourceType: SourceType.Point },
  {
    spectralValue: "wk3iii",
    spectralName: "K3 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rk3iii",
    spectralName: "K3 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "k4iii", spectralName: "K4 III", sourceType: SourceType.Point },
  {
    spectralValue: "wk4iii",
    spectralName: "K4 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "rk4iii",
    spectralName: "K4 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "k5iii", spectralName: "K5 III", sourceType: SourceType.Point },
  {
    spectralValue: "rk5iii",
    spectralName: "K5 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "m0iii", spectralName: "M0 III", sourceType: SourceType.Point },
  { spectralValue: "m1iii", spectralName: "M1 III", sourceType: SourceType.Point },
  { spectralValue: "m2iii", spectralName: "M2 III", sourceType: SourceType.Point },
  { spectralValue: "m3iii", spectralName: "M3 III", sourceType: SourceType.Point },
  { spectralValue: "m4iii", spectralName: "M4 III", sourceType: SourceType.Point },
  { spectralValue: "m5iii", spectralName: "M5 III", sourceType: SourceType.Point },
  { spectralValue: "m6iii", spectralName: "M6 III", sourceType: SourceType.Point },
  { spectralValue: "m7iii", spectralName: "M7 III", sourceType: SourceType.Point },
  { spectralValue: "m8iii", spectralName: "M8 III", sourceType: SourceType.Point },
  { spectralValue: "m9iii", spectralName: "M9 III", sourceType: SourceType.Point },
  { spectralValue: "m10iii", spectralName: "M10 III", sourceType: SourceType.Point },
  { spectralValue: "b2ii", spectralName: "B2 II", sourceType: SourceType.Point },
  { spectralValue: "b5ii", spectralName: "B5 II", sourceType: SourceType.Point },
  { spectralValue: "f0ii", spectralName: "F0 II", sourceType: SourceType.Point },
  { spectralValue: "f2ii", spectralName: "F2 II", sourceType: SourceType.Point },
  { spectralValue: "g5ii", spectralName: "G5 II", sourceType: SourceType.Point },
  { spectralValue: "k01ii", spectralName: "K0-1 II", sourceType: SourceType.Point },
  { spectralValue: "k34ii", spectralName: "K3-4 II", sourceType: SourceType.Point },
  { spectralValue: "m3ii", spectralName: "M3 II", sourceType: SourceType.Point },
  { spectralValue: "b0i", spectralName: "B0 I", sourceType: SourceType.Point },
  { spectralValue: "b1i", spectralName: "B1 I", sourceType: SourceType.Point },
  { spectralValue: "b3i", spectralName: "B3 I", sourceType: SourceType.Point },
  { spectralValue: "b5i", spectralName: "B5 I", sourceType: SourceType.Point },
  { spectralValue: "b8i", spectralName: "B8 I", sourceType: SourceType.Point },
  { spectralValue: "a0i", spectralName: "A0 I", sourceType: SourceType.Point },
  { spectralValue: "a2i", spectralName: "A2 I", sourceType: SourceType.Point },
  { spectralValue: "f0i", spectralName: "F0 I", sourceType: SourceType.Point },
  { spectralValue: "f5i", spectralName: "F5 I", sourceType: SourceType.Point },
  { spectralValue: "f8i", spectralName: "F8 I", sourceType: SourceType.Point },
  { spectralValue: "g0i", spectralName: "G0 I", sourceType: SourceType.Point },
  { spectralValue: "g2i", spectralName: "G2 I", sourceType: SourceType.Point },
  { spectralValue: "g5i", spectralName: "G5 I", sourceType: SourceType.Point },
  { spectralValue: "g8i", spectralName: "G8 I", sourceType: SourceType.Point },
  { spectralValue: "k2i", spectralName: "K2 I", sourceType: SourceType.Point },
  { spectralValue: "k3i", spectralName: "K3 I", sourceType: SourceType.Point },
  { spectralValue: "k4i", spectralName: "K4 I", sourceType: SourceType.Point },
  { spectralValue: "m2i", spectralName: "M2 I", sourceType: SourceType.Point },
  { spectralValue: "uko5v", spectralName: "O5 V", sourceType: SourceType.Point },
  { spectralValue: "uko9v", spectralName: "O9 V", sourceType: SourceType.Point },
  { spectralValue: "ukb0v", spectralName: "B0 V", sourceType: SourceType.Point },
  { spectralValue: "ukb1v", spectralName: "B1 V", sourceType: SourceType.Point },
  { spectralValue: "ukb3v", spectralName: "B3 V", sourceType: SourceType.Point },
  { spectralValue: "ukb57v", spectralName: "B5-7 V", sourceType: SourceType.Point },
  { spectralValue: "ukb8v", spectralName: "B8 V", sourceType: SourceType.Point },
  { spectralValue: "ukb9v", spectralName: "B9 V", sourceType: SourceType.Point },
  { spectralValue: "uka0v", spectralName: "A0 V", sourceType: SourceType.Point },
  { spectralValue: "uka2v", spectralName: "A2 V", sourceType: SourceType.Point },
  { spectralValue: "uka3v", spectralName: "A3 V", sourceType: SourceType.Point },
  { spectralValue: "uka5v", spectralName: "A5 V", sourceType: SourceType.Point },
  { spectralValue: "uka7v", spectralName: "A7 V", sourceType: SourceType.Point },
  { spectralValue: "ukf0v", spectralName: "F0 V", sourceType: SourceType.Point },
  { spectralValue: "ukf2v", spectralName: "F2 V", sourceType: SourceType.Point },
  { spectralValue: "ukf5v", spectralName: "F5 V", sourceType: SourceType.Point },
  {
    spectralValue: "ukwf5v",
    spectralName: "F5 V (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukf6v", spectralName: "F6 V", sourceType: SourceType.Point },
  {
    spectralValue: "ukrf6v",
    spectralName: "F6 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukf8v", spectralName: "F8 V", sourceType: SourceType.Point },
  {
    spectralValue: "ukwf8v",
    spectralName: "F8 V (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrf8v",
    spectralName: "F8 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukg0v", spectralName: "G0 V", sourceType: SourceType.Point },
  {
    spectralValue: "ukwg0v",
    spectralName: "G0 V (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrg0v",
    spectralName: "G0 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukg2v", spectralName: "G2 V", sourceType: SourceType.Point },
  { spectralValue: "ukg5v", spectralName: "G5 V", sourceType: SourceType.Point },
  {
    spectralValue: "ukwg5v",
    spectralName: "G5 V (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrg5v",
    spectralName: "G5 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukg8v", spectralName: "G8 V", sourceType: SourceType.Point },
  { spectralValue: "ukk0v", spectralName: "K0 V", sourceType: SourceType.Point },
  {
    spectralValue: "ukrk0v",
    spectralName: "K0 V (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukk2v", spectralName: "K2 V", sourceType: SourceType.Point },
  { spectralValue: "ukk3v", spectralName: "K3 V", sourceType: SourceType.Point },
  { spectralValue: "ukk4v", spectralName: "K4 V", sourceType: SourceType.Point },
  { spectralValue: "ukk5v", spectralName: "K5 V", sourceType: SourceType.Point },
  { spectralValue: "ukk7v", spectralName: "K7 V", sourceType: SourceType.Point },
  { spectralValue: "ukm0v", spectralName: "M0 V", sourceType: SourceType.Point },
  { spectralValue: "ukm1v", spectralName: "M1 V", sourceType: SourceType.Point },
  { spectralValue: "ukm2v", spectralName: "M2 V", sourceType: SourceType.Point },
  { spectralValue: "ukm2p5v", spectralName: "M2.5 V", sourceType: SourceType.Point },
  { spectralValue: "ukm3v", spectralName: "M3 V", sourceType: SourceType.Point },
  { spectralValue: "ukm4v", spectralName: "M4 V", sourceType: SourceType.Point },
  { spectralValue: "ukm5v", spectralName: "M5 V", sourceType: SourceType.Point },
  { spectralValue: "ukm6v", spectralName: "M6 V", sourceType: SourceType.Point },
  { spectralValue: "ukb2iv", spectralName: "B2 IV", sourceType: SourceType.Point },
  { spectralValue: "ukb6iv", spectralName: "B6 IV", sourceType: SourceType.Point },
  { spectralValue: "uka0iv", spectralName: "A0 IV", sourceType: SourceType.Point },
  { spectralValue: "uka47iv", spectralName: "A4-7 IV", sourceType: SourceType.Point },
  { spectralValue: "ukf02iv", spectralName: "F0-2 IV", sourceType: SourceType.Point },
  { spectralValue: "ukf5iv", spectralName: "F5 IV", sourceType: SourceType.Point },
  { spectralValue: "ukf8iv", spectralName: "F8 IV", sourceType: SourceType.Point },
  { spectralValue: "ukg0iv", spectralName: "G0 IV", sourceType: SourceType.Point },
  { spectralValue: "ukg2iv", spectralName: "G2 IV", sourceType: SourceType.Point },
  { spectralValue: "ukg5iv", spectralName: "G5 IV", sourceType: SourceType.Point },
  { spectralValue: "ukg8iv", spectralName: "G8 IV", sourceType: SourceType.Point },
  { spectralValue: "ukk0iv", spectralName: "K0 IV", sourceType: SourceType.Point },
  { spectralValue: "ukk1iv", spectralName: "K1 IV", sourceType: SourceType.Point },
  { spectralValue: "ukk3iv", spectralName: "K3 IV", sourceType: SourceType.Point },
  { spectralValue: "uko8iii", spectralName: "O8 III", sourceType: SourceType.Point },
  { spectralValue: "ukb12iii", spectralName: "B1-2 ", sourceType: SourceType.Point },
  { spectralValue: "ukb3iii", spectralName: "B3 III", sourceType: SourceType.Point },
  { spectralValue: "ukb5iii", spectralName: "B5 III", sourceType: SourceType.Point },
  { spectralValue: "ukb9iii", spectralName: "B9 III", sourceType: SourceType.Point },
  { spectralValue: "uka0iii", spectralName: "A0 III", sourceType: SourceType.Point },
  { spectralValue: "uka3iii", spectralName: "A3 III", sourceType: SourceType.Point },
  { spectralValue: "uka5iii", spectralName: "A5 III", sourceType: SourceType.Point },
  { spectralValue: "uka7iii", spectralName: "A7 III", sourceType: SourceType.Point },
  { spectralValue: "ukf0iii", spectralName: "F0 III", sourceType: SourceType.Point },
  { spectralValue: "ukf2iii", spectralName: "F2 III", sourceType: SourceType.Point },
  { spectralValue: "ukf5iii", spectralName: "F5 III", sourceType: SourceType.Point },
  { spectralValue: "ukg0iii", spectralName: "G0 III", sourceType: SourceType.Point },
  { spectralValue: "ukg5iii", spectralName: "G5 III", sourceType: SourceType.Point },
  {
    spectralValue: "ukwg5iii",
    spectralName: "G5 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrg5iii",
    spectralName: "G5 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukg8iii", spectralName: "G8 III", sourceType: SourceType.Point },
  {
    spectralValue: "ukwg8iii",
    spectralName: "G8 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukk0iii", spectralName: "K0 III", sourceType: SourceType.Point },
  {
    spectralValue: "ukwk0iii",
    spectralName: "K0 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrk0iii",
    spectralName: "K0 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukk1iii", spectralName: "K1 III", sourceType: SourceType.Point },
  {
    spectralValue: "ukwk1iii",
    spectralName: "K1 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrk1iii",
    spectralName: "K1 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukk2iii", spectralName: "K2 III", sourceType: SourceType.Point },
  {
    spectralValue: "ukwk2iii",
    spectralName: "K2 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrk2iii",
    spectralName: "K2 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukk3iii", spectralName: "K3 III", sourceType: SourceType.Point },
  {
    spectralValue: "ukwk3iii",
    spectralName: "K3 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrk3iii",
    spectralName: "K3 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukk4iii", spectralName: "K4 III", sourceType: SourceType.Point },
  {
    spectralValue: "ukwk4iii",
    spectralName: "K4 III (Metal-Weak)",
    sourceType: SourceType.Point,
  },
  {
    spectralValue: "ukrk4iii",
    spectralName: "K4 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukk5iii", spectralName: "K5 III", sourceType: SourceType.Point },
  {
    spectralValue: "ukrk5iii",
    spectralName: "K5 III (Metal-Rich)",
    sourceType: SourceType.Point,
  },
  { spectralValue: "ukm0iii", spectralName: "M0 III", sourceType: SourceType.Point },
  { spectralValue: "ukm1iii", spectralName: "M1 III", sourceType: SourceType.Point },
  { spectralValue: "ukm2iii", spectralName: "M2 III", sourceType: SourceType.Point },
  { spectralValue: "ukm3iii", spectralName: "M3 III", sourceType: SourceType.Point },
  { spectralValue: "ukm4iii", spectralName: "M4 III", sourceType: SourceType.Point },
  { spectralValue: "ukm5iii", spectralName: "M5 III", sourceType: SourceType.Point },
  { spectralValue: "ukm6iii", spectralName: "M6 III", sourceType: SourceType.Point },
  { spectralValue: "ukm7iii", spectralName: "M7 III", sourceType: SourceType.Point },
  { spectralValue: "ukm8iii", spectralName: "M8 III", sourceType: SourceType.Point },
  { spectralValue: "ukm9iii", spectralName: "M9 III", sourceType: SourceType.Point },
  { spectralValue: "ukm10iii", spectralName: "M10 III", sourceType: SourceType.Point },
  { spectralValue: "ukb2ii", spectralName: "B2 II", sourceType: SourceType.Point },
  { spectralValue: "ukb5ii", spectralName: "B5 II", sourceType: SourceType.Point },
  { spectralValue: "ukf0ii", spectralName: "F0 II", sourceType: SourceType.Point },
  { spectralValue: "ukf2ii", spectralName: "F2 II", sourceType: SourceType.Point },
  { spectralValue: "ukg5ii", spectralName: "G5 II", sourceType: SourceType.Point },
  { spectralValue: "ukk01ii", spectralName: "K0-1 II", sourceType: SourceType.Point },
  { spectralValue: "ukk34ii", spectralName: "K3-4 II", sourceType: SourceType.Point },
  { spectralValue: "ukm3ii", spectralName: "M3 II", sourceType: SourceType.Point },
  { spectralValue: "ukb0i", spectralName: "B0 I", sourceType: SourceType.Point },
  { spectralValue: "ukb1i", spectralName: "B1 I", sourceType: SourceType.Point },
  { spectralValue: "ukb3i", spectralName: "B3 I", sourceType: SourceType.Point },
  { spectralValue: "ukb5i", spectralName: "B5 I", sourceType: SourceType.Point },
  { spectralValue: "ukb8i", spectralName: "B8 I", sourceType: SourceType.Point },
  { spectralValue: "uka0i", spectralName: "A0 I", sourceType: SourceType.Point },
  { spectralValue: "uka2i", spectralName: "A2 I", sourceType: SourceType.Point },
  { spectralValue: "ukf0i", spectralName: "F0 I", sourceType: SourceType.Point },
  { spectralValue: "ukf5i", spectralName: "F5 I", sourceType: SourceType.Point },
  { spectralValue: "ukf8i", spectralName: "F8 I", sourceType: SourceType.Point },
  { spectralValue: "ukg0i", spectralName: "G0 I", sourceType: SourceType.Point },
  { spectralValue: "ukg2i", spectralName: "G2 I", sourceType: SourceType.Point },
  { spectralValue: "ukg5i", spectralName: "G5 I", sourceType: SourceType.Point },
  { spectralValue: "ukg8i", spectralName: "G8 I", sourceType: SourceType.Point },
  { spectralValue: "ukk2i", spectralName: "K2 I", sourceType: SourceType.Point },
  { spectralValue: "ukk3i", spectralName: "K3 I", sourceType: SourceType.Point },
  { spectralValue: "ukk4i", spectralName: "K4 I", sourceType: SourceType.Point },
  { spectralValue: "ukm2i", spectralName: "M2 I", sourceType: SourceType.Point },
];
