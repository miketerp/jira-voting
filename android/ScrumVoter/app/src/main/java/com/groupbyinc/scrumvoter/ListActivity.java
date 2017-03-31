package com.groupbyinc.scrumvoter;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import io.socket.emitter.Emitter;
import io.socket.engineio.client.Socket;

public class ListActivity extends AppCompatActivity {

    private final String LOG = getClass().getSimpleName();

    private ListView sessionList;
    private static ArrayAdapter<String> adapter;
    private Socket socket;

    private static String[] sessionsArray = MockServer.namepaces;
    private static ArrayList<String> sessionsList = new ArrayList<String>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        sessionList = (ListView) findViewById(R.id.session_list);

        sessionsList = new ArrayList<String>(Arrays.asList(sessionsArray));
        adapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_list_item_1, sessionsList);
        sessionList.setAdapter(adapter);

        // Create a message handling object as an anonymous class.
        OnItemClickListener itemClickListener = new OnItemClickListener() {
            public void onItemClick(AdapterView parent, View v, int position, long id) {
                socket.send("Namespace:" + sessionsArray[position]);
                Intent voteActivityIntent = new Intent(parent.getContext(), VoteActivity.class);
                startActivity(voteActivityIntent);
            }
        };

        sessionList.setOnItemClickListener(itemClickListener);

        try {
            socket = new Socket("ws://localhost");
            socket.on(Socket.EVENT_MESSAGE, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    String data = (String)args[0];
                    updateList(data);
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

    public static void updateList(String data) {
        sessionsArray = data.split(",");
        Log.e("ListActivity", "XXX list = " + sessionsArray);
        sessionsList = new ArrayList<String>(Arrays.asList(sessionsArray));
        adapter.notifyDataSetChanged();
    }
}
