import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import "../styles/PBSDetails.css";
import ReactGA from "react-ga";

class PBSDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    return (
      <div className="container">
        <h4>Related Drugs</h4>

        {this.props.pbsData.length > 0 ? (
          <div className="col-md-12 scroll-pbs">
            <div
              className="panel-group"
              id="accordion"
              role="tablist"
              aria-multiselectable="true"
            >
              {this.props.pbsData.map((pbs, i) => (
                <div className="panel panel-default p-1" key={pbs["Item.Code"]}>
                  <div className="panel-heading" role="tab" id="headingTwo">
                    <h4 className="panel-title">
                      <a
                        className="collapsed text-capitalize text-dark text-truncate"
                        role="button"
                        data-toggle="collapse"
                        data-parent="#accordion"
                        href={"#accordion" + pbs["Item.Code"]}
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        {pbs["GenericDrug.Name"].toLowerCase()}{" "}
                        {pbs["Item.Code"]}
                      </a>
                    </h4>
                  </div>
                  <div
                    id={"accordion" + pbs["Item.Code"]}
                    className="panel-collapse collapse"
                    role="tabpanel"
                    aria-labelledby="headingTwo"
                  >
                    <div className="panel-body">
                      <h4 className="text-capitalize">
                        {pbs["Item.FormStrengths"]["Item.FormStrength"]}
                      </h4>
                      <table className="table">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">Brands</th>
                            <th scope="col">Max qty packs</th>
                            <th scope="col">DPMQ</th>
                            <th scope="col">General Patient Charge</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(pbs["Brands"].Brand).map(
                            (key, index) => (
                              <tr key={index}>
                                <th scope="row">
                                  {pbs["Brands"].Brand[key]["Brand.Name"]}
                                </th>
                                <td>
                                  {pbs["Brands"].Brand[key]["Price.PackSize"]}
                                </td>
                                <td>
                                  {
                                    pbs["Brands"].Brand[key][
                                      "Price.ManufacturerDispensedPrice"
                                    ]
                                  }
                                </td>
                                <td>
                                  {
                                    pbs["Brands"].Brand[key][
                                      "Price.PriceToConsumer"
                                    ]
                                  }
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No related drugs</div>
        )}
      </div>
    );
  }
}

export default PBSDetails;
