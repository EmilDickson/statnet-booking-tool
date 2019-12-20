import React, {Component} from 'react';
import './App.css';
import Papa from 'papaparse';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ReactToolTip from 'react-tooltip';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csvfile: undefined,
      newRequests: [],
      emailMessage: ""
    }
    this.updateData = this.updateData.bind(this)
  }

  handleChange = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: false
    })
  }

  updateData(result) {
    var data = result.data;
    for (let i = 3; i < data.length; i++) {
      if (data[i][9] === "Tillfrågad") {
        this.setState({
          newRequests: [...this.state.newRequests, {
            requestId: "request_" + i,
            accepted: false,
            requestInfo: data[i]
          }]
        })
      }
    }
  }

  noteBox = (note) => {
    return(
    <td>
      <FontAwesomeIcon icon={faInfoCircle} data-tip data-for="noteToolTip"/>
      <ReactToolTip id="noteToolTip" ref={this.tooltip} place="top" type="dark" effect="solid" className="toolTipWrapper" clickable>
        <span>
          {note}
        </span>
      </ReactToolTip>
    </td>)
  }

  handleRequestClick = (e) => {
    const { newRequests } = this.state;
    const i = e.target.id;
    let modifiedRequest = newRequests[i];
    modifiedRequest.accepted = !this.state.newRequests[i].accepted;
    this.setState(state => {
      const newRequests = state.newRequests.map((item, j) => {
        if (j === i) {
          return modifiedRequest
        } else {
          return item
        }
      });
      return {
        newRequests,
      };
    });
  }

  generateRequestList = () => {
    const { newRequests } = this.state;
    let requestObjects = [];
    // 0 = datum, 1 = pgm, 2 = CT, 3 = kund, 4 = prod., 5 = liga, 6 = hemma, 7 = borta, 8 = mitt namn (?), 9 = status, 10 = notering
    for (let i = 0; i < newRequests.length; i++) {
      requestObjects.push(
        <tr key={"request_" + i}>
          <td>{newRequests[i].requestInfo[0]}</td>
          <td>{newRequests[i].requestInfo[2] + " (" + newRequests[i].requestInfo[1] + ")"}</td>
          <td>{newRequests[i].requestInfo[4] + " (" + newRequests[i].requestInfo[5] + ")"}</td>
          <td>{newRequests[i].requestInfo[6] + " - " + newRequests[i].requestInfo[7]}</td>
          {newRequests[i].requestInfo[10].length > 0 ? this.noteBox(newRequests[i].requestInfo[10]) : <td></td>}
          <td id={i} onClick={e => this.handleRequestClick(e)}>
            {newRequests[i].accepted ?
              <FontAwesomeIcon icon={faThumbsUp} style={{"pointerEvents": "none"}} /> :
              <FontAwesomeIcon icon={faThumbsDown} style={{"pointerEvents": "none"}} />}
          </td>
        </tr>
      )
    }
    return requestObjects;
  }

  copyToClipboard = () => {
    const el = this.textArea
    el.select()
    document.execCommand("copy")
  }

  formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  generateOutputCsv = (date, info) => {
    // Returnera en lista som är på csvDataOut-formatet
    const newDate = date[1] + "/" + date[2] + "/" + date[0];
    const rawCT = new Date(
      parseInt(date[0]),
      parseInt(date[1] - 1),
      parseInt(date[2]),
      parseInt(info[2].split(":")[0]),
      parseInt(info[2].split(":")[1])
    );
    const rawPGM = new Date(
      parseInt(date[0]),
      parseInt(date[1] - 1),
      parseInt(date[2]),
      parseInt(info[1].split(":")[0]) + 2,
      parseInt(info[1].split(":")[1]) + 40
    );
    return [
      "Statnet " + info[5] + " " + info[6] + " - " + info[7] + " (" + info[4] + ")",
      newDate,
      this.formatAMPM(rawCT),
      newDate,
      this.formatAMPM(rawPGM),
      info[10].replace(new RegExp(",", "g"), ".")
    ]
  }

  generateBookings = () => {
    const { newRequests } = this.state;
    const monthNames = {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "Maj",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Okt",
      11: "Nov",
      12: "Dec",
    };
    // Email message
    let message = "";
    let csvDataOut = [["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description"]]
    for (let i = 0; i < newRequests.length; i++) {
      const answer = newRequests[i].accepted ? "Ja" : "Nej";
      let date = newRequests[i].requestInfo[0].split('-');
      message += date[2] + " " + monthNames[parseInt(date[1])] + ": " + answer + "\n"
      if (newRequests[i].accepted) {
        csvDataOut.push(this.generateOutputCsv(date, newRequests[i].requestInfo));
      }
    }
    this.setState({
      emailMessage: message
    });
    // Skapa csv-filen här.
    console.log(Papa.unparse(csvDataOut));
    let csvContent = "data:text/csv;charset=utf-8," + csvDataOut.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }

  render() {
    return (
      <div className="App">
        <h2>Statnet booking CSV generator</h2>
        <input
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <p />
        <Button onClick={this.importCSV}>Ladda upp fil</Button>
        {this.state.newRequests.length > 0 ? (
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
        ) : null}
        <Button onClick={this.generateBookings} variant="success">Klar</Button>
        {this.state.emailMessage.length > 0 ? (
          <div className="emailMessage">
            <h3>Svarsmeddelande att maila till bokning:</h3>
            <textarea
              ref={textarea => (this.textArea = textarea)}
              value={this.state.emailMessage}
              readOnly
            />
            <Button onClick={this.copyToClipboard} variant="info">Kopiera meddelande</Button>
          </div>
        ) : null}
      </div>
    );
}
}
