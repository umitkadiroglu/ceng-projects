package com.emugamestudios.mytagram;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;

import java.io.File;

public class PostActivity extends AppCompatActivity {

    static final int CAPTURE_IMAGE = -1;
    ImageView img;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_post);

        img = findViewById(R.id.imageView);
        img.setOnClickListener(new View.OnClickListener() {
            @SuppressLint("QueryPermissionsNeeded")
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

                if (intent.resolveActivity(getPackageManager()) != null){
                    startActivityForResult(intent, CAPTURE_IMAGE);
                }
            }
        });


        final EditText txtMsg = (EditText)findViewById(R.id.txtMessage);
        ImageButton btnOk = (ImageButton) findViewById(R.id.btnOk);
        btnOk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                Bundle bundle = new Bundle();
                bundle.putCharSequence("msg",txtMsg.getText());
                bundle.putParcelable("bitmap",((BitmapDrawable)img.getDrawable()).getBitmap());
                intent.putExtras(bundle);
                setResult(Activity.RESULT_OK,intent);
                finish();
            }
        });
        ImageButton btnCancel = (ImageButton) findViewById(R.id.btnCancel);
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setResult(Activity.RESULT_CANCELED);
                finish();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == CAPTURE_IMAGE && resultCode == Activity.RESULT_OK) {
            Bundle bundle = data.getExtras();
            Bitmap image = (Bitmap) bundle.get("data");
            img.setImageBitmap(image);
        }
    }

}
