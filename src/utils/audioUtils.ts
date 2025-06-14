export class AudioManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  playToneForValue(value: number, paramType: string) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    let baseFreq = 200;
    switch (paramType) {
      case 'color': baseFreq = 300; break;
      case 'length': baseFreq = 250; break;
      case 'width': baseFreq = 200; break;
      case 'layers': baseFreq = 350; break;
    }

    oscillator.frequency.setValueAtTime(baseFreq + (value * 3), this.audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  playRareFormSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.4);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.8);
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}