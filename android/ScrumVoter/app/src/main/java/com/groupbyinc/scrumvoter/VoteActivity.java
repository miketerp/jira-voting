package com.groupbyinc.scrumvoter;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.NumberPicker;
import android.widget.TextView;

public class VoteActivity extends AppCompatActivity {

    private TextView id;
    private TextView title;
    private Button button;
    private LinearLayout waitingLayout;
    private LinearLayout votingLayout;
    private NumberPicker picker;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vote);
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

        id = (TextView) findViewById(R.id.text_id);
        title = (TextView) findViewById(R.id.text_title);
        picker = (NumberPicker) findViewById(R.id.picker);
        button = (Button) findViewById(R.id.voting_buttons);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String value = Integer.toString(picker.getValue());
                System.out.println("XXX Chosen Value = " + value);
                //TODO: send value
                votingLayout.setVisibility(View.GONE);
                waitingLayout.setVisibility(View.VISIBLE);
            }
        });

        waitingLayout = (LinearLayout) findViewById(R.id.waiting);
        votingLayout = (LinearLayout) findViewById(R.id.voting);

        updateViews("SR - 400", "Build stuff for the Hackathon and now with overflow text", new int [] {1,2,3,5,8,13});
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

    public void updateViews(String idText, String titleText, int [] points) {
        String [] p = new String[points.length];
        for(int i = 0; i < points.length; i++) {
            p[i] = Integer.toString(points[i]);
        }

        updateViews(idText, titleText, p);
    }

    public void updateViews(String idText, String titleText, String [] points) {
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
}
