import React, {Component} from 'react';
import './App.css';
import Papa from 'papaparse';
import Button from 'react-bootstrap/Button';
import RequestTable from './components/RequestTable';

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
          <RequestTable newRequests={this.state.newRequests} handleRequestClick={this.handleRequestClick.bind(this)} />
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
