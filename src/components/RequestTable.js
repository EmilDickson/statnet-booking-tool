import React, { Component } from "react";
import "../App.css";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import ReactToolTip from "react-tooltip";

export default class RequestTable extends Component {
  noteBox = note => {
    return (
      <td>
        <FontAwesomeIcon icon={faInfoCircle} data-tip data-for="noteToolTip" />
        <ReactToolTip
          id="noteToolTip"
          ref={this.tooltip}
          place="top"
          type="dark"
          effect="solid"
          className="toolTipWrapper"
          clickable
        >
          <span>{note}</span>
        </ReactToolTip>
      </td>
    );
  };

  generateRequestList = () => {
    const { newRequests, handleRequestClick } = this.props;
    let requestObjects = [];
    // 0 = datum, 1 = pgm, 2 = CT, 3 = kund, 4 = prod., 5 = liga, 6 = hemma, 7 = borta, 8 = mitt namn (?), 9 = status, 10 = notering
    for (let i = 0; i < newRequests.length; i++) {
      requestObjects.push(
        <tr key={"request_" + i}>
          <td>{newRequests[i].requestInfo[0]}</td>
          <td>
            {newRequests[i].requestInfo[2] +
              " (" +
              newRequests[i].requestInfo[1] +
              ")"}
          </td>
          <td>
            {newRequests[i].requestInfo[4] +
              " (" +
              newRequests[i].requestInfo[5] +
              ")"}
          </td>
          <td>
            {newRequests[i].requestInfo[6] +
              " - " +
              newRequests[i].requestInfo[7]}
          </td>
          {newRequests[i].requestInfo[10].length > 0 ? (
            this.noteBox(newRequests[i].requestInfo[10])
          ) : (
            <td></td>
          )}
          <td id={i} onClick={e => handleRequestClick(e)}>
            {newRequests[i].accepted ? (
              <FontAwesomeIcon
                icon={faThumbsUp}
                style={{ pointerEvents: "none" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faThumbsDown}
                style={{ pointerEvents: "none" }}
              />
            )}
          </td>
        </tr>
      );
    }
    return requestObjects;
  };

  render() {
    return (
      <div className="tableWrapper">
        <Table bordered hover>
          <thead>
            <tr>
              <th>Datum</th>
              <th>CT (pgm)</th>
              <th>Prod.</th>
              <th>Lag</th>
              <th>Notering</th>
              <th>Accepterad</th>
            </tr>
          </thead>
          <tbody>{this.generateRequestList()}</tbody>
        </Table>
      </div>
    );
  }
}
