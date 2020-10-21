import assert from "assert";
import plural from "plural-ru";

const declension = (word) => {
  return [word, `${word}а`, `${word}ов`];
};

// lightweight version
const TRIPLETS_NAMES = [
  null,
  ["тысяча", "тысячи", "тысяч"],
  declension("миллион"),
  declension("миллиард"),
  declension("триллион"),
  declension("квадрилион"),
  declension("квинтиллион"),
  declension("секстиллион"),
  declension("септиллион"),
  declension("октиллион"),
  declension("нониллион"),
  declension("дециллион"),
  declension("ундециллион"),
  declension("дуодециллион"),
  declension("тредециллион"),
  declension("кваттуордециллион"),
  declension("квиндециллион"),
  declension("сексдециллион"),
  declension("септендециллион")
];

const THOUSANDS_NAMES = [
  null,
  "одна",
  "две",
  "три",
  "четыре",
  "пять",
  "шесть",
  "семь",
  "восемь",
  "девять"
];

const HUNDREDS_NAMES = [
  null,
  "сто",
  "двести",
  "триста",
  "четыреста",
  "пятьсот",
  "шестьсот",
  "семьсот",
  "восемьсот",
  "девятьсот"
];

const DOZENS_NAMES = [
  null,
  null,
  "двадцать",
  "тридцать",
  "сорок",
  "пятьдесят",
  "шестьдесят",
  "семьдесят",
  "восемьдесят",
  "девяносто"
];

const UNIT_NAMES = [
  "ноль",
  "один",
  "два",
  "три",
  "четыре",
  "пять",
  "шесть",
  "семь",
  "восемь",
  "девять"
];

const TEN_UNIT_NAMES = [
  "десять",
  "одиннадцать",
  "двенадцать",
  "тринадцать",
  "четырнадцать",
  "пятнадцать",
  "шестнадцать",
  "семнадцать",
  "восемнадцать",
  "девятнадцать"
];

function intToText(number = "") {
  const result = [];

  if (typeof number !== `string`) {
    number = number + "";
  }

  const length = number.length;

  for (let i = 0; i < length; i += 1) {
    const position = length - 1 - i;
    const tripletIndex = Math.floor(position / 3);

    let digit = position % 3;
    let tripletOfZerosMask = 0;
    let currentValue = parseInt(number[i], 10);

    switch (digit) {
      case 0:
      default:
        const previousValue = i - 1 >= 0 ? parseInt(number[i - 1], 10) : null;

        if (currentValue === 0) {
          tripletOfZerosMask |= 0b1;

          if (length === 1) {
            result.push("ноль");
          }
        } else if ((previousValue && previousValue !== 1) || !previousValue) {
          if (tripletIndex === 1) {
            result.push(THOUSANDS_NAMES[currentValue]);
          } else {
            result.push(UNIT_NAMES[currentValue]);
          }
        }

        const tripletNames = TRIPLETS_NAMES[tripletIndex];
        if (tripletNames && tripletOfZerosMask !== 0b111) {
          if (previousValue === 1) {
            result.push(plural(10 + currentValue, ...tripletNames));
          } else {
            result.push(plural(currentValue, ...tripletNames));
          }
        }

        continue;

      case 1:
        if (currentValue === 0) {
          tripletOfZerosMask |= 0b10;
        } else if (currentValue === 1) {
          result.push(TEN_UNIT_NAMES[parseInt(number[i + 1], 10)]);
        } else if (currentValue) {
          result.push(DOZENS_NAMES[currentValue]);
        }

        continue;

      case 2:
        tripletOfZerosMask = 0;
        if (currentValue === 0) {
          tripletOfZerosMask |= 0b100;
        } else if (currentValue) {
          result.push(HUNDREDS_NAMES[currentValue]);
        }

        continue;
    }
  }

  return result.join(" ");
}

assert.equal(intToText(0), "ноль");
assert.equal(intToText(1), "один");
assert.equal(intToText(10), "десять");
assert.equal(intToText(11), "одиннадцать");
assert.equal(intToText(14), "четырнадцать");
assert.equal(intToText(20), "двадцать");
assert.equal(intToText(21), "двадцать один");
assert.equal(intToText(100), "сто");
assert.equal(intToText(101), "сто один");
assert.equal(intToText(110), "сто десять");
assert.equal(intToText(111), "сто одиннадцать");
assert.equal(intToText(123), "сто двадцать три");
assert.equal(intToText(1000), "одна тысяча");
assert.equal(intToText(1001), "одна тысяча один");
assert.equal(intToText(1010), "одна тысяча десять");
assert.equal(intToText(1100), "одна тысяча сто");
assert.equal(intToText(1110), "одна тысяча сто десять");
assert.equal(intToText(1111), "одна тысяча сто одиннадцать");
assert.equal(intToText(1101), "одна тысяча сто один");
assert.equal(intToText(1011), "одна тысяча одиннадцать");
assert.equal(
  intToText(12381027497162490),
  "двенадцать квадрилионов триста восемьдесят один триллион двадцать семь миллиардов четыреста девяносто семь миллионов сто шестьдесят две тысячи четыреста девяносто"
);
