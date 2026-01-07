import axios from "axios";
import debounce from "lodash.debounce";

export const checkEmailExists = debounce(async (email, resolve, reject) => {
  try {
    const { data } = await axios.get("check-email-exists", {
      params: { email },
    });

    if (data.email === email) {
      reject("Email is already in use");
    } else {
      resolve();
    }
  } catch (error) {
    // reject("Unable to validate email existence");
    // console.log(error);
  }
}, 500);

export const checkUsernameExists = debounce(
  async (username, resolve, reject) => {
    try {
      const { data } = await axios.get("check-username-exists", {
        params: { username },
      });

      //console.log("Username exists check data:", data);
      if (data.username === username) {
        reject("Username is already in use");
      } else {
        resolve();
      }
    } catch (error) {
      //   reject("Unable to validate username existence");
      //   console.log(error);
    }
  },
  500
);
