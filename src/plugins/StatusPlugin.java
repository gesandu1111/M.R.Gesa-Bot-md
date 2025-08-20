package plugins;

public class StatusPlugin implements Plugin {
    @Override
    public String getName() {
        return "📢 StatusPlugin";
    }

    @Override
    public void execute() {
        // Simulate status update logic
        System.out.println("📣 Bot status: සූදානම්යි! HASA ecosystem එක active වෙලා තියෙනවා.");
    }
}
