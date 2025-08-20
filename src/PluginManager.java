import java.util.*;
import plugins.Plugin; // ✅ Import the Plugin interface

public class PluginManager {
    private List<Plugin> plugins = new ArrayList<>();

    public void loadPlugin(Plugin plugin) {
        plugins.add(plugin);
        System.out.println("🔌 Plugin loaded: " + plugin.getName());
    }

    public void runAll() {
        for (Plugin plugin : plugins) {
            plugin.execute();
        }
    }
}
