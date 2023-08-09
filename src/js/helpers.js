import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            );
        }, s * 1000);
    });
};

export async function AJAX(url, uploadData = undefined) {
    try {
        let fetchPro = uploadData
            ? fetch(url, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(uploadData),
              })
            : fetch(url);
        let res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        let resData = await res.json();
        if (!res.ok) throw new Error(`${resData.message} (${res.status})`);
        return await resData;
    } catch (err) {
        throw err;
    }
}
/*
export async function getJSON(url) {
    try {
        let resData = await res.json();
        if (!res.ok) throw new Error(`${resData.message} (${res.status})`);
        return await resData;
    } catch (err) {
        throw err;
    }
}

export async function sentJSON(url, uploadData) {
    try {
        console.log("uploadData", uploadData);
        let res = await Promise.race([
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(uploadData),
            }),
            timeout(TIMEOUT_SEC),
        ]);
        let resData = await res.json();
        if (!res.ok) throw new Error(`${resData.message} (${res.status})`);
        return await resData;
    } catch (err) {
        throw err;
    }
}
*/
