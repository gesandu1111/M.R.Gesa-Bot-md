package plugins;

public class MenuPlugin implements Plugin {
    public String getName() {
        return "Menu";
    }

    public void execute() {
        System.out.println("📜 Menu plugin executing...");
        System.out.println("👋 Welcome to M.R.Gesa Bot! Type .menu to begin.");
    }
}
