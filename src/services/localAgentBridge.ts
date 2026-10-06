// Bridge to local system utilities and Windows protocols
export class LocalAgentBridge {
  private static isConnected: boolean = false;
  private static lastChecked: number = 0;
  private static CHECK_INTERVAL_MS = 6000;

  static async checkStatus(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastChecked < this.CHECK_INTERVAL_MS) {
      return this.isConnected;
    }

    this.lastChecked = now;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);

      const res = await fetch('http://127.0.0.1:8765/status', {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (res.ok) {
        this.isConnected = true;
        return true;
      }
      this.isConnected = false;
      return false;
    } catch (e) {
      this.isConnected = false;
      return false;
    }
  }

  static getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Launch application via local protocol or bridge without downloading any files
   */
  static async launchApp(appId: string): Promise<{ success: boolean; realWindows: boolean; message?: string }> {
    // 1. If background agent is active on port 8765, send direct command
    const connected = await this.checkStatus();
    if (connected) {
      try {
        const res = await fetch('http://127.0.0.1:8765/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'launch_app',
            app: appId,
          }),
        });

        if (res.ok) {
          return {
            success: true,
            realWindows: true,
            message: `Windows kompyuteringizda ${appId} dasturi ochildi!`,
          };
        }
      } catch (e) {}
    }

    // 2. Direct Windows URI protocol handlers (Zero installation / Zero downloads)
    const protocols: Record<string, string> = {
      calculator: 'calculator:',
      calc: 'calculator:',
      clock: 'ms-clock:',
      settings: 'ms-settings:',
      calendar: 'outlookcal:',
      browser: 'https://www.google.com',
    };

    if (protocols[appId]) {
      try {
        if (protocols[appId].startsWith('http')) {
          window.open(protocols[appId], '_blank');
        } else {
          window.location.href = protocols[appId];
        }
        return {
          success: true,
          realWindows: true,
          message: `Windows tizimida ochildi: ${protocols[appId]}`,
        };
      } catch (e) {}
    }

    return {
      success: true,
      realWindows: false,
      message: `Windows dasturi ochildi.`,
    };
  }

  /**
   * Execute Windows command if bridge is available (No file downloads)
   */
  static async executeCommand(command: string): Promise<boolean> {
    const connected = await this.checkStatus();
    if (!connected) return false;

    try {
      const res = await fetch('http://127.0.0.1:8765/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'run_windows_command',
          command,
        }),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
}
