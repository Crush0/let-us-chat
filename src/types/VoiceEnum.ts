export enum VoiceEvent {
    initiateCall = "initiateCall",
    acceptCall = "acceptCall",
    audioStream = "audioStream",
    hangUp = "hangUp",
}

export enum VoiceState {
    disconnected = 'disconnected',
    waitingForAccept = 'waitingForAccept',
    inCall = 'inCall',
}