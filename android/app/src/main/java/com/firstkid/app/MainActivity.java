package com.firstkid.app;

import android.Manifest;
import android.os.Bundle;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import android.content.pm.PackageManager;

public class MainActivity extends BridgeActivity {
	private static final int REQUEST_PERMISSIONS = 1234;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// Request CAMERA and RECORD_AUDIO if not granted. This helps getUserMedia in the WebView.
		if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED
				|| ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
			ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO}, REQUEST_PERMISSIONS);
		}
	}

	@Override
	public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
		// Forward results to BridgeActivity / Capacitor so WebView getUserMedia can proceed if allowed
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
	}
}
