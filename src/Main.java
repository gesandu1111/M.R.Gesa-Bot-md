import java.util.*;
import plugins.*;
import javax.imageio.ImageIO;
import java.io.File;

public class Main {
    public static void main(String[] args) {
        System.out.println("🔷 M.R.Gesa Bot initializing...");
        PluginManager manager = new PluginManager();

        // Load plugins
        manager.loadPlugin(new MenuPlugin());
        manager.loadPlugin(new StatusPlugin());

        // Branding image
        try {
            File branding = new File("assets/branding.png");
            if (branding.exists()) {
                System.out.println("✅ Branding image loaded: " + branding.getName());
            }
        } catch (Exception e) {
            System.out.println("⚠️ Branding image not found.");
        }

        // Simulate bot running
        manager.runAll();
    }
}
