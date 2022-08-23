/********************************************************
Copyright (c) 2022 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*********************************************************
 * 
 * Macro Author:      	William Mills
 *                    	Technical Solutions Specialist 
 *                    	wimills@cisco.com
 *                    	Cisco Systems
 * 
 * Version: 1-0-0
 * Released: 08/23/22
 * 
 * This is a simple macro which disables the selfview and speakertrack features
 * on a Webex Device. It also adds a easily accessible restart button the main UI.
 * https://github.com/wxsd-sales/selfview-macro
 * 
 ********************************************************/
import xapi from 'xapi';

const config = {
  buttonName: 'Restart Device',
  panelId: 'restart_panel'
}

function main() {
  createPanel();
  xapi.Event.UserInterface.Extensions.Panel.Clicked.on(monitorButton);
  xapi.Config.Video.Selfview.Default.Mode.set('Off');
  xapi.Config.Video.Selfview.OnCall.Mode.set('Off');
  xapi.Status.Video.Selfview.Mode.on(monitorSelfview);
}

main();

function monitorButton(event) {
  if (event.PanelId === config.panelId) {
    console.log('Restart button pressed, restarting device');
    xapi.Command.SystemUnit.Boot({
      Action: 'Restart',
      Force: 'True'
    });
  }
}

function monitorSelfview(event) {
  if (event === 'On') {
    console.log('Selfview visible, hiding it');
    xapi.Command.Video.Selfview.Set({ Mode: 'Off' });
  }
}

// Here we create the Button and Panel for the UI
function createPanel() {
  const panel = `
  <Extensions>
    <Version>1.9</Version>
    <Panel>
      <Location>HomeScreenAndCallControls</Location>
      <Type>Statusbar</Type>
      <Icon>Power</Icon>
      <Color>#FC5143</Color>
      <Name>${config.buttonName}</Name>
      <ActivityType>Custom</ActivityType>
    </Panel>
  </Extensions>`;

  xapi.Command.UserInterface.Extensions.Panel.Save(
    { PanelId: config.panelId },
    panel
  )
}
