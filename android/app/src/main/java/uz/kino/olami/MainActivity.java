package uz.kino.olami;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.view.WindowManager;
import android.webkit.*;
import android.widget.*;
public class MainActivity extends Activity {
 private WebView web; private String origin; private ValueCallback<Uri[]> files; private FrameLayout root; private View fullscreen; private WebChromeClient.CustomViewCallback fullCallback;
 private SharedPreferences prefs;
 @Override public void onCreate(Bundle state){super.onCreate(state);prefs=getSharedPreferences("kino",MODE_PRIVATE);origin=prefs.getString("origin","");if(origin.isEmpty())setup();else launch();}
 private void setup(){LinearLayout panel=new LinearLayout(this);panel.setOrientation(1);panel.setPadding(32,48,32,32);TextView t=new TextView(this);t.setText("Kino Olami\nVercel saytingizning HTTPS manzilini kiriting");t.setTextSize(20);panel.addView(t);EditText field=new EditText(this);field.setSingleLine();field.setInputType(17);field.setHint("https://kino-olami.vercel.app");field.setText(origin);panel.addView(field);Button b=new Button(this);b.setText("Ilovani ochish");panel.addView(b);b.setOnClickListener(v->{try{Uri u=Uri.parse(field.getText().toString().trim());if(!"https".equals(u.getScheme())||u.getHost()==null||u.getUserInfo()!=null||u.getPort()!=-1||u.getQuery()!=null||u.getFragment()!=null)throw new Exception();origin="https://"+u.getHost();prefs.edit().putString("origin",origin).apply();launch();}catch(Exception e){field.setError("To‘g‘ri HTTPS sayt manzili kerak");}});setContentView(panel);}
 private boolean same(Uri u){Uri base=Uri.parse(origin);return "https".equals(u.getScheme())&&base.getHost().equalsIgnoreCase(u.getHost())&&u.getPort()==-1;}
 private void launch(){root=new FrameLayout(this);web=new WebView(this);root.addView(web,new FrameLayout.LayoutParams(-1,-1));setContentView(root);WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(false);s.setAllowContentAccess(true);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);s.setMediaPlaybackRequiresUserGesture(true);s.setSupportMultipleWindows(false);
 web.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){if(!r.isForMainFrame())return false;Uri u=r.getUrl();if(same(u))return false;if("https".equals(u.getScheme())){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception ignored){}}return true;}});
 web.setWebChromeClient(new WebChromeClient(){@Override public boolean onShowFileChooser(WebView w,ValueCallback<Uri[]> cb,FileChooserParams p){if(files!=null)files.onReceiveValue(null);files=cb;try{startActivityForResult(p.createIntent(),42);}catch(Exception e){files.onReceiveValue(null);files=null;return false;}return true;}
 @Override public void onShowCustomView(View v,CustomViewCallback cb){if(fullscreen!=null){cb.onCustomViewHidden();return;}fullscreen=v;fullCallback=cb;root.addView(v,new FrameLayout.LayoutParams(-1,-1));web.setVisibility(View.GONE);getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);}
 @Override public void onHideCustomView(){hideVideo();}});
 web.setDownloadListener((url,agent,disposition,mime,length)->{try{Uri u=Uri.parse(url);if(!"https".equals(u.getScheme()))throw new Exception();String name=URLUtil.guessFileName(url,disposition,mime);DownloadManager.Request req=new DownloadManager.Request(u);req.setMimeType(mime);req.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);req.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,name);((DownloadManager)getSystemService(DOWNLOAD_SERVICE)).enqueue(req);Toast.makeText(this,"Yuklash boshlandi",Toast.LENGTH_SHORT).show();}catch(Exception e){Toast.makeText(this,"Oflayn saqlash tugmasidan foydalaning",Toast.LENGTH_LONG).show();}});
 web.loadUrl(origin+"/");}
 private void hideVideo(){if(fullscreen==null)return;root.removeView(fullscreen);fullscreen=null;web.setVisibility(View.VISIBLE);getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);if(fullCallback!=null)fullCallback.onCustomViewHidden();fullCallback=null;}
 @Override protected void onActivityResult(int req,int result,Intent data){super.onActivityResult(req,result,data);if(req==42&&files!=null){files.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result,data));files=null;}}
 @Override public void onBackPressed(){if(fullscreen!=null){hideVideo();return;}if(web!=null&&web.canGoBack()){web.goBack();return;}new AlertDialog.Builder(this).setItems(new String[]{"Ilovani yopish","Sayt manzilini o‘zgartirish"},(d,i)->{if(i==0)finish();else{if(web!=null){web.destroy();web=null;}setup();}}).show();}
}
