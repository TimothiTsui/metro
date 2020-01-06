import React, { Component } from "react";
import SimplePanel from "./SimplePanel";
import {
	ButtonGroup,
	Button,
	Collapse,
	ButtonDropdown,
	DropdownToggle,
	DropdownItem,
	DropdownMenu
} from "reactstrap";
import { PlayModes } from "./PlayModes";
import { PlaybackModes } from "./PlaybackModes";
import GeometricSlider from "./GeometricSlider";
import AdvancedRange from "./AdvancedRange"
import AdvancedSlider from "./AdvancedSlider"
import DiscreteSlider from "./DiscreteSlider"
import Utils from "./Utils";
import { InitPreset } from "./PresetsLib";
import Tr, { TrRange } from "./Locale"
class ModePanel extends Component {
	state = {
		bpmStep: this.props.bpmStep,
		bpmRange: this.props.bpmRange,
		//bpmStableSlider={this.props.bpmStableSlider}
		currentBpm: this.props.bpmRange[0],
		playbackMode: this.props.playbackMode,
		playMode: this.props.playMode,
		stepsNum: this.props.stepsNum,
		exerciseTime: this.props.exerciseTime,
		bpmStepDropdownOpen: false,
		byTimeInterval: this.props.byTimeInterval,
		byBarInterval: this.props.byBarInterval,
		constantBpmSlider: 300
	}
	
	onAfterChange(e) {
		this.props.onChange()
	}

	onModeChange(newMode) {
		// console.log('onModeChange')
		this.setState({ playMode: newMode }, this.onAfterChange);		
	}



	onBpmRangeChange(bpmRange) {
		// console.log('<ModePanel>onBpmRangeChange(' + bpmRange[0] + ')')
		this.setState({ bpmRange: bpmRange }, this.onAfterChange);
	}

	onBpmSliderChange = (value) => {
		// console.log('onBpmSliderChange', value)
		this.setState({ constantBpmSlider: value }, this.onAfterChange);
	}

	onBpmStepChange() {
		this.setState(prevState => ({
			bpmStepDropdownOpen: !prevState.bpmStepDropdownOpen
		}));
	}

	onBpmStepSelect(value) {
		this.setState({ bpmStep: value }, this.onAfterChange);
	}

	setValue(o) {
		console.log('ModePanel.setValue', o)

		this.refs.byBarSlider.setValue(o.byBarInterval || InitPreset.byBarInterval)
		this.refs.byTimeSlider.setValue(o.byTimeInterval || InitPreset.byTimeInterval)
		this.refs.exerciseTimeSlider.setValue(o.exerciseTime || InitPreset.exerciseTime);

		this.refs.bpmRange.setState({ bounds: o.bpmRange })
		this.setState(
			{
				playMode: o.playMode,
				playbackMode: o.playbackMode || this.state.playbackMode,
				bpmStep: o.bpmStep,
				exerciseTime: o.exerciseTime || this.state.exerciseTime,
				stepsNum: o.stepsNum || this.state.stepsNum,
				byBarInterval: o.byBarInterval,// || this.state.byBarInterval,
				byTimeInterval: o.byTimeInterval, //|| this.state.byTimeInterval,
				bpmRange: o.bpmRange,

				constantBpmSlider: o.constantBpmSlider || this.state.constantBpmSlider

			},
			this.onAfterChange
		);

	}

	onTimeIntervalChange(v) {
		this.setState({ byTimeInterval: v, interval: v }, this.onAfterChange);
	}

	onBarIntervalChange(v) {
		this.setState({ byBarInterval: v, interval: v }, this.onAfterChange);
	}

	byBarFormatter(barsNum) {
		let s = barsNum + " ";
		// if (barsNum === 1) {
		s += TrRange(barsNum, "bars");
		// } else {
		// s += Tr("bars");
		// }
		return s;
	}

	byTimeFormatter(time) {
		return Utils.formatTimeLong(time)
	}

	renderIncreaseBpmDropdown() {
		// debugger
		return (
			<>
				<ButtonDropdown
					style={{ margin: "0px 5px" }}
					isOpen={this.state.bpmStepDropdownOpen}
					toggle={() => this.onBpmStepChange()}
				>
					<DropdownToggle caret size="sm" outline color="light">
						{this.state.bpmStep}
						{/* {this.state.bpmStep} */}
					</DropdownToggle>
					<DropdownMenu>
						{[1,2,3,5,10,15,20,30,50,100].map(el => {
							return <DropdownItem onClick={() => {this.onBpmStepSelect(el)}}>{el}</DropdownItem>
						})
					}
					</DropdownMenu>
				</ButtonDropdown>
				bpm
			</>
		);
	}

	onStepsSliderChange(value) {
		this.setState({ stepsNum: value }, this.onAfterChange);
	}

	onExerciseTimeSliderChange(value) {
		// console.log('exerciseTimeSliderChanged', value)
		this.setState({ exerciseTime: value }, this.onAfterChange);
	}



	renderTimeSlider() {
		return (<div>
			{Tr("Exercise Time")}
			<DiscreteSlider
				ref="exerciseTimeSlider"
				badgeFormatter={Utils.formatTimeLong}
				markFormatter={Utils.formatTime}
				marks={{ 300: '5 m', 600: '10 m', 900: '15 m', 1200: '20 m', 1800: '30 m', 3600: '1 ' + Tr('hr'), 7200: '2 ' + Tr('hrs'), 10800: '3 ' + Tr('hrs') }}
				defaultValue={600}
				onChange={(value) => this.onExerciseTimeSliderChange(value)}
			/>
		</div>);
	}

	renderStepsSlider() {
		return (<div>
			{Tr("Number of steps")}
			<AdvancedSlider
				ref="stepsSlider"
				min={2}
				included={false}
				max={100}
				marks={{ 2: '2', 10: '10', 20: '20', 30: '30', 40: '40', 50: '50', 60: '60', 70: '70', 80: '80', 90: '90', 100: '100' }}
				defaultValue={10}
				onChange={(value) => this.onStepsSliderChange(value)}
			/>
		</div>);
	}
	renderSpeedRange() {

		// console.log('renderSpeedRange', this.state.bpmRange[0])
		return (<div>
			{Tr("BPM range")}
			<AdvancedRange
				ref="bpmRange"
				min={30}
				max={1200}
				defaultValue={[
					this.state.bpmRange[0],
					this.state.bpmRange[1]
				]}
				pushable={true}
				onAfterChange={(value) => this.onBpmRangeChange(value)}
			/>
		</div>);
	}

	render() {
		return (
			<SimplePanel className="ModePanel" title="Mode" width="300px">
				<h6>{Tr('Increase speed')}</h6>
				<ButtonGroup size="sm">
					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.SET_TIME)}
						active={this.state.playMode === PlayModes.SET_TIME}
					>
						{Tr("Set time")}
					</Button>
					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.BY_BAR)}
						active={this.state.playMode === PlayModes.BY_BAR}
					>
						{Tr("By bar")}
					</Button>
					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.BY_TIME)}
						active={this.state.playMode === PlayModes.BY_TIME}
					>
						{Tr("By time")}
					</Button>

					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.CONSTANT)}
						active={this.state.playMode === PlayModes.CONSTANT}
					>
						{Tr("Stable")}
					</Button>
				</ButtonGroup>



				<Collapse isOpen={this.state.playMode !== PlayModes.CONSTANT}>
					{this.renderSpeedRange()}
				</Collapse>

				<Collapse isOpen={this.state.playMode === PlayModes.SET_TIME}>
					{this.renderTimeSlider()}
					{this.renderStepsSlider()}
				</Collapse>

				<Collapse isOpen={this.state.playMode === PlayModes.BY_BAR}>

					<div>
						{Tr("Increase speed every")}
						<GeometricSlider
							ref="byBarSlider"
							defaultValue={this.state.byBarInterval}
							badgeFormatter={this.byBarFormatter}
							onChange={v => this.onBarIntervalChange(v)}
							min={1}
							max={301}
							marksAt={[1, 2, 5, 10, 20, 50, 100, 300]}
						/>
					</div>
				</Collapse>
				<Collapse isOpen={this.state.playMode === PlayModes.BY_TIME}>
					<div>

						{Tr("Increase speed every")}
						<GeometricSlider
							ref="byTimeSlider"
							defaultValue={this.state.byTimeInterval}
							badgeFormatter={Utils.formatTimeLong}
							markFormatter={Utils.formatTime}
							onChange={v => this.onTimeIntervalChange(v)}
							min={1}
							max={1200}
							marksAt={[1, 2, 5, 10, 30, 60, 120, 240, 600, 1200]}
						/>
					</div>
				</Collapse>

				<Collapse isOpen={this.state.playMode !== PlayModes.CONSTANT && this.state.playMode !== PlayModes.SET_TIME}>
					{this.renderIncreaseBpmDropdown()}
				</Collapse>

				<Collapse isOpen={this.state.playMode === PlayModes.CONSTANT}>
					<div>
						Choose bpm

						<AdvancedSlider
							ref="constantBpmSlider"
							included={false}
							min={10}
							max={1200}
							marks={{ 30: '30', 100: '100', 200: '200', 300: '300', 400: '400', 500: '500', 600: '600',700: '700',800: '800', 900: '900', 1000: '1000', 1100: '1100', 1200: '1200' }}
							value={this.state.constantBpmSlider}
							onChange={this.onBpmSliderChange}
						/>
					</div>
				</Collapse>

			</SimplePanel>
		);
	}
}

export default ModePanel;

ModePanel.defaultProps = {
	playMode: InitPreset.playMode,
	playbackMode: InitPreset.playbackMode,
	interval: InitPreset.interval,
	bpmStep: InitPreset.bpmStep,
	bpmRange: InitPreset.bpmRange,
	byTimeInterval: InitPreset.byTimeInterval,
	byBarInterval: InitPreset.byBarInterval,
	stepsNum: InitPreset.stepsNum,
	exerciseTime: InitPreset.exerciseTime,
	//bpmStableSlider={this.props.bpmStableSlider}
	currentBpm: InitPreset.bpmRange[0],
	// defaultValue={{playMode: this.props.playMode, interval: this.props.interval, bpmStep: this.props.bpmStep}}
	// onAfterChange={() => this.onModePanelChanged()}
	onAfterChange: null
};
