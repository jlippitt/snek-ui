import { AudioController as AudioControllerInterface } from 'snek-client';

export default class AudioController implements AudioControllerInterface {
  private context: AudioContext;
  private expectedTime: number;

  constructor(sampleRate: number) {
    this.context = new AudioContext({ sampleRate });
    this.expectedTime = this.context.currentTime;
  }

  public close() {
    this.context.close();
  }

  public suspend() {
    this.context.suspend();
  }

  public resume() {
    this.context.resume();
  }

  public sendAudioData(buffer: AudioBuffer) {
    this.expectedTime += buffer.duration;

    if (this.expectedTime < this.context.currentTime) {
      this.expectedTime = this.context.currentTime;
    }

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(this.expectedTime);
  }
}
