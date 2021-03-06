import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import $ from 'jquery';

import FACE from './../../lib/FACE-1.0.js';
import env from './../../../env/client-config.js';
import RecordInstructions from './record-instructions.jsx';
import RecordQuestions from './record-questions.jsx';

export default class RecordView extends React.Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    FACE.webcam.startPlaying('webcam');
    FACE.webcam.startPlaying('recordcam');
  }

  _createNewSession (e) {
    var formData = {
     title: $('.record-title')[0].value,
     subject: $('.record-subject')[0].value,
     description: $('.record-description')[0].value
    }

    $.ajax({
      type: 'POST',
      url: '/api/session',
      data: formData,
      success: function (newSession) {
        console.log('New Session: ' + newSession.id);
        this.props.setRecordState('sessionId', newSession.id);
        this._startRecording();
        this._loadprompt();
      }.bind(this),
      error: function (error) {
        console.error('startRecording error', error);
      },
      dataType: 'json'
    });
  }

  _loadprompt () {
    $('.record-instructions').remove();
    this.props.setRecordState('showQuestions', true);
  }

  _startRecording () {
    var intervalId = setInterval (function () {
      FACE.webcam.takePicture('recordcam', 'current-snapshot');
      this._takeSnapshot();
    }.bind(this), 1000);

    this.props.setRecordState('intervalId', intervalId);
    this.props.setRecordState('startTime', Date.now());
  }

  _takeSnapshot () {
    var snapshot = document.querySelector('#current-snapshot');
    if ( snapshot.naturalWidth == 0 || snapshot.naturalHeight == 0 ) {
      return;
    }

    // Process snapshot and make API call
    var snapshotBlob = FACE.util.dataURItoBlob(snapshot.src);
    var successCb = function (data) {
      // console.log(snapshotData.persons[0]);
      this._createNewSnapshot(data.persons[0])
    }.bind(this);
    var errorCb = function (err) {
      console.error('_sendSnapshot error', err);
    }

    FACE.sendImage(
      snapshotBlob,
      successCb, errorCb,
      env.FACE_APP_KEY, env.FACE_CLIENT_ID
    );
  }

  _createNewSnapshot (snapshotData) {
    let sessionId = this.props.sessionId;

    $.ajax({
      method: 'POST',
      url: '/api/snapshot',
      data: {
        sessionId: sessionId,
        snapshotData: snapshotData
      },
      success: function (newSnapshot) {
        console.log('New snapshot created.', newSnapshot);
      },
      error: function(error) {
        console.error('_createNewSnapshot error', error);
      },
      dataType: 'json'
    });
  }

  _endSession () {
    this.props.setRecordState('showQuestions', false);
    console.log('Session ended.');
    clearInterval(this.props.intervalId);
    this._calcDuration();

    // Wait 2 seconds after stop button is pressed
    setTimeout(function () {
      FACE.webcam.stopPlaying('recordcam');
      browserHistory.push('/reports/' + this.props.sessionId.toString());
    }.bind(this), 1000)
  }

  _calcDuration () {
    let sessionId = this.props.sessionId;

    if (this.props.startTime !== undefined) {
        var endTime = Date.now();
        var difference = endTime - this.props.startTime;
        difference = Math.round(difference/1000)
    }
    console.log(difference, 'this is the difference in seconds')
    //create ajax request to update /api/sessions of sessionId
    $.ajax({
      type: 'POST',
      url: '/api/session/update',
      data: {
        difference: difference,
        sessionId: sessionId
      },
      success: function (updatedSession) {
        console.log(updatedSession, 'UPDATED DURATION')
      }.bind(this),
      error: function (error) {
        console.error('_calcDuration error', error)
      },
      dataType: 'json'
    });
  }

  render () {
    return (
      <div className="pure-g record-container">
        <div className="pure-u-2-3 record-box">
          <video id='webcam' className="pure-u-1-1 record-webcam" autoplay></video>
        </div>
        <div className="pure-u-1-3 record-form">
          { this.props.showQuestions ?
              <RecordQuestions clicked={this._endSession.bind(this)}/> :
              <RecordInstructions clicked={this._createNewSession.bind(this)}/>
          }
        </div>
      </div>
    );
  }
}

