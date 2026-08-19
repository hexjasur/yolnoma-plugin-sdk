import React from 'react';

export function HelloPage(): React.ReactElement {
  return (
    <div
      style={{
        padding: '32px',
        color: '#F2EDE6',
      }}
    >
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 600,
          marginBottom: '12px',
        }}
      >
        Hello from Plugin 👋
      </h1>

      <p
        style={{
          color: 'rgba(242,237,230,0.6)',
          fontSize: '14px',
        }}
      >
        This page is running from an external Yolnoma plugin.
      </p>
    </div>
  );
}
