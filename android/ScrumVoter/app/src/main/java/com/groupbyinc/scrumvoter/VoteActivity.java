package com.groupbyinc.scrumvoter;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.NumberPicker;
import android.widget.TextView;

import java.net.URISyntaxException;

import io.socket.emitter.Emitter;
import io.socket.engineio.client.Socket;

public class VoteActivity extends AppCompatActivity {

    private final String LOG = getClass().getSimpleName();

    static private TextView id;
    static private TextView title;
    private Button button;
    static private LinearLayout waitingLayout;
    static private LinearLayout votingLayout;
    static private NumberPicker picker;
    Socket socket;

    final Handler handler = new Handler();
    handler.postDelayed(new Runnable() {
        @Override
        public void run() {
            // Do something after 5s = 5000ms
            buttons[inew][jnew].setBackgroundColor(Color.BLACK);
        }
    }, 5000);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vote);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        id = (TextView) findViewById(R.id.text_id);
        title = (TextView) findViewById(R.id.text_title);
        picker = (NumberPicker) findViewById(R.id.picker);
        button = (Button) findViewById(R.id.voting_buttons);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String value = Integer.toString(picker.getValue());
//                System.out.println("XXX Chosen Value = " + value);
//                socket.send("Vote:" + value);
                votingLayout.setVisibility(View.GONE);
                waitingLayout.setVisibility(View.VISIBLE);
                try {
                    server();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        waitingLayout = (LinearLayout) findViewById(R.id.waiting);
        votingLayout = (LinearLayout) findViewById(R.id.voting);

        try {
            socket = new Socket("ws://localhost");
            socket.on(Socket.EVENT_MESSAGE, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    updatePage((String)args[0]);
                }
            }).on(Socket.EVENT_ERROR, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    Exception err = (Exception)args[0];
                    Log.e(LOG, "SOCKET FAILURE: " + err);
                }
            });
            socket.open();
        } catch (URISyntaxException e) {
            Log.e(LOG, "SOCKET OPENING FAILURE");
        }

        MockServer.n = 0;
        try {
            server();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

//        updateViews("SR - 400", "Build stuff for the Hackathon and now with overflow text", new int [] {1,2,3,5,8,13});
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_list, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.action_logout:
                logout();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void logout() {
        socket.send("logout");
        Intent logout = new Intent(this, LoginActivity.class);
        logout.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(logout);
    }

    public void updateViews(String idText, String titleText, int [] points) {
        String [] p = new String[points.length];
        for(int i = 0; i < points.length; i++) {
            p[i] = Integer.toString(points[i]);
        }

        updateViews(idText, titleText, p);
    }

    public static void updateViews(String idText, String titleText, String [] points) {
        Log.e("VOTEACTIVITY", "DDDDD");
        id.setText(idText);
        title.setText(titleText);

        picker.setDisplayedValues(points);
        picker.setMinValue(0);
        picker.setMaxValue(points.length-1);
        picker.setWrapSelectorWheel(false);
        picker.setDescendantFocusability(NumberPicker.FOCUS_BLOCK_DESCENDANTS);

        waitingLayout.setVisibility(View.GONE);
        votingLayout.setVisibility(View.VISIBLE);
    }

    public static void updatePage(String ticket) {
        Log.e("VOTEACTIVITY", "CCCCCC");
        String [] data = ticket.split(":");
        String id = data[0];
        String title = data[1];
        String [] points = data[2].split(",");
        updateViews(id, title, points);
    }

    private void server() throws InterruptedException {
        Thread.sleep(10000);
        updatePage(MockServer.getTicket(MockServer.SR));
    }
}
