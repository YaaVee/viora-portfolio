// Jitsi integration for portfolio
function initJitsiMeeting(roomName, displayName) {
    const domain = 'localhost'; // Change to your domain
    const options = {
        roomName: roomName,
        width: '100%',
        height: 500,
        parentNode: document.querySelector('#jitsi-container'),
        configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableRecording: true,
            enableNoAudioDetection: true,
            enableNoisyMicDetection: true,
            enableClosePage: true,
            enableWelcomePage: false,
            enableE2EE: true,
            prejoinPageEnabled: false,
            toolbarButtons: [
                'microphone', 'camera', 'closedcaptions', 'desktop',
                'fullscreen', 'fodeviceselection', 'hangup',
                'profile', 'chat', 'recording', 'livestreaming',
                'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'feedback', 'stats',
                'shortcuts', 'tileview', 'videobackgroundblur',
                'download', 'help', 'mute-everyone', 'security'
            ]
        },
        interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop',
                'fullscreen', 'fodeviceselection', 'hangup',
                'profile', 'chat', 'recording', 'livestreaming',
                'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'feedback', 'stats',
                'shortcuts', 'tileview', 'videobackgroundblur',
                'download', 'help', 'mute-everyone', 'security'
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: '#0a0a0a',
            VIDEO_LAYOUT_FIT: 'both',
            ENABLE_FEEDBACK_ANIMATION: false,
            DISABLE_FOCUS_INDICATOR: false,
            DISABLE_DOMINANT_SPEAKER_INDICATOR: false
        },
        userInfo: {
            displayName: displayName
        }
    };

    const api = new JitsiMeetExternalAPI(domain, options);
    
    // Event handlers
    api.addEventListener('videoConferenceJoined', (event) => {
        console.log('Joined conference:', event.roomName);
        api.executeCommand('displayName', displayName);
    });
    
    api.addEventListener('participantJoined', (event) => {
        console.log('Participant joined:', event.id);
    });
    
    api.addEventListener('readyToClose', () => {
        console.log('Conference ended');
    });
    
    return api;
}

// Recording function
async function startRecording(api) {
    try {
        await api.executeCommand('startRecording', {
            mode: 'file',
            dropboxToken: 'your-token' // Optional for cloud storage
        });
        console.log('Recording started');
    } catch (error) {
        console.error('Failed to start recording:', error);
    }
}

// Screen sharing
function shareScreen(api) {
    api.executeCommand('toggleShareScreen');
}

// Chat message
function sendChatMessage(api, message) {
    api.executeCommand('sendEndpointTextMessage', '', message);
}

// E2EE toggle
function toggleE2EE(api) {
    api.executeCommand('toggleE2EE');
}

export { initJitsiMeeting, startRecording, shareScreen, sendChatMessage, toggleE2EE };
