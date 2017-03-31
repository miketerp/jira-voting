package com.groupbyinc.scrumvoter;

import android.os.AsyncTask;
import android.os.StrictMode;
import android.util.Log;

/**
 * Created by Bane on 2017-03-31.
 */

public class MockServer {

    public static final String SR = "Searchendiser";
    public static final String SRE = "SRE";
    public static final String BBD = "StoreFront";
    public static final String WIS = "Wisdom";
    public static final String SC = "Shopping Cart";

    public static final String [] namepaces = {SR, SRE, BBD, WIS, SC};

    public static String namespace = "";
    public static int n = 0;

    public static int position = 0;

    public updateVotes getTask() {
        return new updateVotes();
    }


    public class oAuth extends AsyncTask<String, Integer, Long> {
        protected void doInBackground(String userPass) throws InterruptedException {
            Thread.sleep(1000);
            ListActivity.updateList(SR+","+SRE+","+ BBD +","+WIS+","+SC);
        }

        protected void onProgressUpdate(Integer... progress) {
        }

        @Override
        protected Long doInBackground(String... params) {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            ListActivity.updateList(SR+","+SRE+","+ BBD +","+WIS+","+SC);
            return null;
        }

        protected void onPostExecute(Long result) {
        }
    }

    public abstract class setNamespace extends AsyncTask<String, Integer, Long> {
        protected void doInBackground(String ns) throws InterruptedException {
            Thread.sleep(2000);
            namespace = ns;
            n = 0;
            VoteActivity.updatePage(getTicket());
        }

        protected void onProgressUpdate(Integer... progress) {
        }

        protected void onPostExecute(Long result) {
        }
    }

    public class updateVotes extends AsyncTask<String, Integer, Long> {
        protected void doInBackground(String ns) throws InterruptedException {
            Log.e("MOCKSERVER", "AAAAA");
            Thread.sleep(10000);
            namespace = ns;
            n = 0;
            VoteActivity.updatePage(getTicket());
        }

        protected void onProgressUpdate(Integer... progress) {
        }

        @Override
        protected Long doInBackground(String... params) {
            Log.e("MOCKSERVER", "AAAAA");
            try {
                Thread.sleep(10000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            namespace = params[0];
            n = 0;
            VoteActivity.updatePage(getTicket());
            return null;
        }

        protected void onPostExecute(Long result) {
        }
    }

    public static String getTicket() {
        String result = "GBI";

        switch (position) {
            case 0:
                result = "SR";
                break;
            case 1:
                result = "SRE";
                break;
            case 2:
                result = "BBD";
                break;
            case 3:
                result = "WIS";
                break;
            case 4:
                result = "SC";
                break;
            default:
                result = "SR";
                break;
        }

        n++;

        result+="-" + (234 + n) + ":" + getMessage() + ":1,2,3,5,8,13,21";

        return result;
    }

    private static String getMessage() {
        switch (n) {
            case 1:
                return "Make CC great again.";
            case 2:
                return "Do stuff.";
            case 3:
                return "500 errors and stuff.";
            case 4:
                return "Sitemaps :(";
            case 5:
                return "Templates yo.";
            default:
                return "Hackathons are fun.";
        }
    }
}
