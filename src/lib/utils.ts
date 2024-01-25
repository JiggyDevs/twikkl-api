import * as moment from 'moment';
import { hash as bcryptHash, compare } from 'bcrypt';
import slugify from 'slugify';
import { env } from 'src/config';
import {
  randomBytes,
  pbkdf2Sync,
  createCipheriv,
  createDecipheriv,
} from 'crypto';
import { ethers } from 'ethers';

export const convertDate = (date: any) => {
  return new Date(date).toISOString();
};

export const getDaysDate = (startDate: any, stopDate: any) => {
  let dateArray = [];
  let currentDate = moment(startDate);
  let stopDatee = moment(stopDate);
  while (currentDate <= stopDatee) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
};

export const isEmpty = (value: any) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

const saltRound = 10;

export const hash = async (password: string) => {
  const hash = await bcryptHash(password, saltRound);
  return hash;
};

/** compare hash password */
export const compareHash = async (password: string, hashedPassword: string) => {
  const bool = await compare(password, hashedPassword);
  return bool;
};

export const encryptPrivateKeyWithPin = (pin: string, privateKey: string) => {
  const salt = randomBytes(16).toString('hex');
  const key = pbkdf2Sync(pin, salt, 100000, 32, 'sha256');
  const cipher = createCipheriv('aes-256-cbc', key, Buffer.from(salt, 'hex'));
  let encryptedPrivateKey = cipher.update(privateKey, 'utf-8', 'hex');
  encryptedPrivateKey += cipher.final('hex');
  return encryptedPrivateKey;
};

export const decryptPrivateKeyWithPin = (
  pin: string,
  privateKey: string,
): string | null => {
  try {
    // Derive key using PIN and decrypt private key
    const salt = privateKey.slice(0, 32); // Assuming the salt is stored at the beginning
    const key = pbkdf2Sync(pin, salt, 100000, 32, 'sha256');
    const decipher = createDecipheriv(
      'aes-256-cbc',
      key,
      Buffer.from(salt, 'hex'),
    );
    let decryptedPrivateKey = decipher.update(
      privateKey.slice(32),
      'hex',
      'utf-8',
    );
    decryptedPrivateKey += decipher.final('utf-8');

    return decryptedPrivateKey;
  } catch (error) {
    console.error('Error decrypting private key:', error.message);
    return null;
  }
};

export const generatePrivateKey = () => {
  return ethers.Wallet.createRandom().privateKey;
};

export const maybePluralize = (count: number, noun: string, suffix = 's') =>
  `${noun}${count !== 1 ? suffix : ''}`;

/** generate random number */
export const randomFixedInteger = (length: number) => {
  const power10minus1 = 10 ** (length - 1);
  const power10 = 10 ** length;
  let rand = Math.floor(
    power10minus1 + Math.random() * (power10 - power10minus1 - 1),
  );
  if (String(rand).slice(0, 1) === '0') {
    rand = Math.floor(Math.random() * 899999 + 100000);
  }
  return rand;
};

export const secondsToDhms = (secs: number | string) => {
  const seconds = Number(secs);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
  var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  let dhms = dDisplay + hDisplay + mDisplay + sDisplay;
  dhms = String(dhms).trim();
  if (dhms.endsWith(',')) dhms = String(dhms).slice(0, dhms.length - 1);
  return dhms;
};

/** checks if both verification fields are true then returns true */
export const isVerified = (
  emailVerified: boolean,
  phoneVerified: boolean,
): boolean => {
  return emailVerified && phoneVerified;
};

export const createSlug = (word: string) => {
  return slugify(word, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: false, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'vi', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  });
};

const generateRef = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateWalletRef = () => {
  const key = env.isProd ? 'TR_LIVE_' : 'TR_TEST_';
  const reference = key + generateRef(6);
  return reference;
};

export const generateTXRef = () => {
  const key = env.isProd ? 'TR_REF_LIVE_' : 'TR_REF_TEST_';
  const reference = key + generateRef(6);
  return reference;
};

export const generateTXHash = () => {
  const key = env.isProd ? 'TR_HASH_LIVE_' : 'TR_HASH_TEST_';
  const reference = key + generateRef(6);
  return reference;
};

// export const generateReferralCode = () => {
//   const refCode = otpGenerator.generate(6, { digits: true, alphabets: true, upperCaseAlphabets: false, specialCharacters: false });
//   return refCode
// }

function indexOfMax(arr: number[]) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

function removeSpecialChars(str: string) {
  return str
    .replace(/(?!\w|\s)./g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

const sortStringAndRemoveDuplicates = (stry: string): string[] => {
  const stro = stry.split(' ');
  return stro.map((str) =>
    removeSpecialChars(
      [...new Set(String(str).trim().toLowerCase().split(''))]
        .sort(function (a, b) {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        })
        .join(''),
    ),
  );
};

export const basicWordFinder = (
  _word: string,
  _word1: string,
  _word2: string,
): boolean => {
  const lowerCaseWord = _word.toLowerCase();
  // if either any of them is not found throw an error
  if (
    lowerCaseWord.indexOf(_word1.toLowerCase()) === -1 ||
    lowerCaseWord.indexOf(_word2.toLowerCase()) === -1
  )
    return false;
  return true;
};

export const wordFinder = (
  _word: string,
  _word1: string,
  _word2: string,
): boolean => {
  const basicFinder = basicWordFinder(_word, _word1, _word2);
  if (basicFinder) return true;

  const adjustedWord = sortStringAndRemoveDuplicates(_word);
  const adjustedWord1 = sortStringAndRemoveDuplicates(_word1);
  const adjustedWord2 = sortStringAndRemoveDuplicates(_word2);

  const allWords = [adjustedWord, adjustedWord1, adjustedWord2];
  const allWordsCount = allWords.map((w) => w.length);

  const indexOfMostWords = indexOfMax(allWordsCount);
  const { [indexOfMostWords]: longestList, ...otherListy } = {
    0: adjustedWord,
    1: adjustedWord1,
    2: adjustedWord2,
  } as Record<number, string[]>;

  const otherList = Object.values(otherListy).map((v) => v[0]);

  let matchesCount = 0;
  const maxMatchesPossible = longestList.length;

  longestList.forEach((strl) => {
    otherList.forEach((stro) => {
      if (stro.includes(strl) || strl.includes(stro)) matchesCount++;
    });
  });

  if (maxMatchesPossible > 2) {
    if (matchesCount > maxMatchesPossible / 2) return true;
  } else {
    if (matchesCount >= maxMatchesPossible) return true;
  }

  return false;
};
