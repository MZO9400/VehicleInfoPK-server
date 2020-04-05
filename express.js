const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const FormData = require("form-data");
const qs = require("querystring");
var beautify_html = require("js-beautify").html;

app.use(express.json());
app.use(cors());
app.post("/Islamabad", (req, res) => {
  const fD = new FormData();
  fD.append("TREGNO", req.body.VehicleNumber);
  const link = "http://58.65.128.82:8080/ovd/vehForm.php";
  const headers = {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      Referer: "http://58.65.128.82:8080/ovd/vehform.php",
      Origin: "http://58.65.128.82:8080",
      "Content-Type": `multipart/form-data; boundary=${fD._boundary}`,

      Host: "58.65.128.82:8080"
    }
  };
  axios
    .post(link, fD.getBuffer(), headers)
    .then(rs => {
      if (rs.data.toUpperCase().indexOf("OWNER") === -1) {
        res
          .status(404)
          .send("<h3>Vehicle not found against the searched number</h3>");
        return;
      }
      try {
        let html = rs.data
          .split(`<table width="90% border="1" cellpadding="2">`)[1]
          .split(`</table>`);
        html =
          `<table width="90% border="1" cellpadding="2">` + html + `</table>`;
        html = beautify_html(html);
        res.status(200).send(html);
      } catch (e) {
        res.status(200).send(rs.data);
      }
    })
    .catch(e => res.status(500).send(e));
});

app.post("/Punjab", (req, res) => {
  const link = "http://www.mtmis.excise-punjab.gov.pk/";
  const data = qs.stringify({
    vhlno: req.body.vhlno,
    "g-recaptcha-response": "1"
  });
  const headers = {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      Referer: "http://www.mtmis.excise-punjab.gov.pk/",
      Origin: "http://www.mtmis.excise-punjab.gov.pk",
      "Content-Type": "application/x-www-form-urlencoded",
      Host: "www.mtmis.excise-punjab.gov.pk"
    }
  };
  axios
    .post(link, data, headers)
    .then(rs => {
      if (rs.data.toUpperCase().indexOf("OWNER") === -1) {
        res
          .status(404)
          .send("<h3>Vehicle not found against the searched number</h3>");
        return;
      }
      try {
        let html = rs.data.split(`<table`)[1].split(`</table>`)[0];
        html = `<table` + html + `</table>`;
        html = beautify_html(html);
        res.status(200).send(html);
      } catch (e) {
        res.status(200).send(rs.data);
      }
    })
    .catch(e => res.status(500).send(e));
});

app.post("/Sindh", (req, res) => {
  const link = "http://excise.gos.pk/vehicle/vehicle_result";
  const headers = {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      Referer: "http://excise.gos.pk/vehicle/vehicle_search",
      Origin: "http://excise.gos.pk",
      "Content-Type": "application/x-www-form-urlencoded",
      Host: "excise.gos.pk"
    }
  };
  const data = qs.stringify({
    wheelers_type: req.body.wheelers_type,
    reg_no: req.body.reg_no
  });
  axios
    .post(link, data, headers)
    .then(rs => {
      if (rs.data.toUpperCase().indexOf("OWNER") === -1) {
        res
          .status(404)
          .send("<h3>Vehicle not found against the searched number</h3>");
        return;
      }
      try {
        let html = rs.data.split(`<div class="col-md-8 content_height">`)[1];
        html = html.split(`<!-- sidebar -->`)[0];
        html =
          `<div class="col-md-8 content_height">
      ` + html;
        html = html
          .split(
            `<input type="button" value="Print" style="float:right" class="btn btn-primary" onClick="window.print()">`
          )
          .join(" ");

        html = beautify_html(html);
        res.status(200).send(html);
      } catch (e) {
        res.status(200).send(rs.data);
      }
    })
    .catch(e => res.status(500).send(e));
});

module.exports = app;
