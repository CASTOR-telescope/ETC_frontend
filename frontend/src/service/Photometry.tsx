import { useState, useEffect } from "react";
import { API_URL } from "./env";
import { Button } from "../components/Button";

class PhotometryApi {
  static async photometryParams(value: number, valueType: "snr" | "t" = "snr") {
    const returnedResponse = await fetch(`http://localhost:5000/photometry`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ snr: value, snr_type: valueType }),
    })
      .then(async (response) => await response.json())
      .then((responseJSON) => {
        console.log("responseJSON", responseJSON);
      })
      .catch((error) => {
        console.log(error);
      });
    return returnedResponse;
  }
}

// async function logResults() {
//   console.log(Promise.resolve(PhotometryApi.photometryParams(5, "snr")));
// }
const Photometry = () => {
  const [photResults, setPhotResults] = useState([]);

  // console.log(PhotometryApi.photometryParams(1, "snr"));

  // Modify the current state by setting the new data to
  // the response from the backend
  useEffect(() => {
    fetch(API_URL + "photometry", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => setPhotResults(response))
      .catch((error) => console.log(error));
  }, []);

  // const someResults = Flask.url_for("photometry", { value: 1, value_type: "snr" });
  // console.log(JSON.stringify({ someResults }));

  // FIXME: need to wait for the backend to return the results
  // console.log(Promise.resolve(PhotometryApi.photometryParams(5, "snr")));
  console.log(PhotometryApi.photometryParams(5, "snr"));

  return (
    <div className="row">
      {/* {props.articles &&
        props.articles.map((article) => {
          return (
            <div key={article.id} className="col-md-6 ">
              <h2 className="text-primary"> {article.title} </h2>
              <p> {article.body} </p>
              <p>
                {" "}
                <i className="bi bi-clock m-1"></i>
              </p>
            </div>
          );
        })} */}
      <p>{JSON.stringify(photResults)}</p>
    </div>
  );
};

export default Photometry;
