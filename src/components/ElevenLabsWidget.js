import React from 'react';
import { WebView } from 'react-native-webview';

const ElevenLabsWidget = ({ agentId, onMessage }) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        elevenlabs-convai {
          width: 100%;
          height: 100vh;
        }
      </style>
    </head>
    <body>
      <elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>
      <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
    </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
      onMessage={(event) => {
        if (onMessage) {
          onMessage(event.nativeEvent.data);
        }
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

export default ElevenLabsWidget;
