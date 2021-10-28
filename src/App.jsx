import { IoTDataPlaneClient, PublishCommand } from "@aws-sdk/client-iot-data-plane";
import { Amplify } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';
import "bootstrap/dist/css/bootstrap.css";
import "rc-slider/assets/index.css";
import React, { Component } from "react";
import ReactGA from 'react-ga';
import { Badge, Col, Container, Row } from "reactstrap";
import "./App.css";
import Tr from './components/Locale';
import SimplePanel from "./components/SimplePanel";
import SoundMachine from "./components/SoundMachine";

async function publishToIoTTopic(message) {
	const credentials = await Auth.currentCredentials();

	const client = new IoTDataPlaneClient({
		region: "us-east-1",
		credentials: {
			accessKeyId: credentials.accessKeyId,
			secretAccessKey: credentials.secretAccessKey,
			sessionToken: credentials.sessionToken,
		},
	});

	const command = new PublishCommand({
		topic: 'user/input',
		payload: JSON.stringify(message),
	});

	try {
		const data = await client.send(command);
		console.log("Data published successfully", data);
	} catch (error) {
		console.log("An error occurred", error);
		const credentials = await Auth.currentCredentials();
		console.log(credentials);

	}
}

Amplify.configure({
	Auth: {
		// REQUIRED - Amazon Cognito Identity Pool ID
		identityPoolId: 'us-east-1:8aa80d16-dbed-4c5c-bd37-811ff00df62f',
		// REQUIRED - Amazon Cognito Region
		region: 'us-east-1',
		// OPTIONAL - Amazon Cognito User Pool ID
		userPoolId: 'us-east-1_sMVcwbzfj',
		// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
		userPoolWebClientId: 'cutkv6l3b7ep3i4s3ki0iclas',
	}
});

class App extends Component {

	state = {
		showMask: true,
		bpm: 120, // initial BPM value
		timeSignature: "4/4" // initial time signature value
	};

	componentDidMount() {

		// google analytics
		ReactGA.initialize({
			trackingId: 'UA-151010848-1',
			debug: false,
			gaOptions: {
				cookieDomain: 'none'
			}
		});

		ReactGA.pageview(window.location.pathname + window.location.search);

	}

	handleBpmChange = (bpm) => {
		// update bpm in state
		this.setState({ bpm });
	}

	handleTimeSignatureChange = (timeSignature) => {
		this.setState({ timeSignature });
	};




	handleButtonClick = () => {
		const message = {
			metronomeID: 125, // replace with actual metronome ID
			inputDATA: {
				bpm: this.state.bpm,
				time_signature: this.state.timeSignature
			}
		};

		publishToIoTTopic(message);
	}


	removeLoadMask() {
		this.setState({ showMask: false });
	}

	render() {
		return (
			<div className="App">
				<Container className="app-container ">
					<Row>
						<Col>
							<SoundMachine
								onReady={() => this.removeLoadMask()}
								getBpm={this.state.bpm}
								timeSignature={this.state.timeSignature} // Add this line to pass timeSignature as prop
								ref="sm"
							/>
						</Col>
					</Row>
					<Col>
						<button onClick={this.handleButtonClick}>Publish BPM and Time Signature</button>

					</Col>
					<Row>
						<Col>
							<SimplePanel title={Tr("Keyboard controls")} className="about">
								<div><code>{Tr("arrow up/down")}</code> - {Tr("higher/lower BPM")}</div>
								<div><code>{Tr("arrow left/right")}</code> - {Tr("previous/next step according to plan")}</div>
								<div><code>space, s</code> - {Tr("start/stop")}</div>
								<div><code>esc</code> - {Tr("stop")}</div>
							</SimplePanel>
						</Col>
					</Row>
					<Row>
						<Col>
							<div className="footer">
								<div><h6>If you like this app consider donation to a developer using following <Badge href="https://www.buymeacoffee.com/indiebubbler" target="blank">link</Badge></h6></div>
								<div>Join discord using <Badge href="https://discord.gg/fAwnmVh" target="blank">this link</Badge> for feedback and improvement suggestions.</div>
								<div>By using this site you agree to the use of cookies to store user defined presets and analytics.</div>

								<div>If you want help translating this page please contact <Badge href="mailto:indiebubbler@gmail.com?subject=Feedback">indiebubbler@gmail.com</Badge>.</div>
								<div>Made using <Badge href="https://reactjs.org/" target="blank" >React</Badge> and <Badge href="https://tonejs.github.io/" target="blank">Tone.js</Badge>.</div>
								<div>Ideas for visualisation and presets taken from <Badge href="http://www.ethanhein.com/wp/my-nyu-masters-thesis" target="blank">Ethan Hein's site</Badge>.</div>
								<div>&#169; IndieBubbler 2019-2020. Version 2.2</div>
							</div>
						</Col>
					</Row>
				</Container>
				<div ref="loadMask" className={this.state.showMask === true ? 'loadmask ' : 'loadmask fadeOut'} />
			</div>

		);
	}

}

export default (App);
