package com.groupbyinc.scrumvoter;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import java.net.URISyntaxException;

import io.socket.emitter.Emitter;
import io.socket.engineio.client.Socket;

public class ListActivity extends AppCompatActivity {

    private ListView sessionList;
    private ArrayAdapter<String> adapter;
    private Socket socket;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

//        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
//        fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                        .setAction("Action", null).show();
//            }
//        });

        sessionList = (ListView) findViewById(R.id.session_list);

        adapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_list_item_1, getSessionList());
        sessionList.setAdapter(adapter);

        // Create a message handling object as an anonymous class.
        OnItemClickListener itemClickListener = new OnItemClickListener() {
            public void onItemClick(AdapterView parent, View v, int position, long id) {
                if(setSession(position)) {
                    Intent voteactivityIntent = new Intent(parent.getContext(), VoteActivity.class);
                    startActivity(voteactivityIntent);
                } else {
//                    Toast error = new Toast.makeText(getApplicationContext(), "Error", Toast.LENGTH_SHORT);
//                    error.show();
                }
            }
        };

        sessionList.setOnItemClickListener(itemClickListener);

        try {
            socket = new Socket("ws://localhost");
            socket.on(Socket.EVENT_OPEN, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    socket.send("hi");
                    socket.close();
                }
            });
            socket.open();
        } catch (URISyntaxException e) {
            e.printStackTrace();
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
        //TODO logout
        Intent logout = new Intent(this, LoginActivity.class);
        logout.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(logout);
    }

    static String[] getSessionList() {
        return new String[] {"Searchendiser", "SRE", "StoreFront", "Wisdom", "Shopping Cart", "Services"};
    }

    static boolean setSession(int index) {
        return true;
    }
}
