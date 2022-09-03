using SignalRMiniChatApp.Models;

namespace SignalRMiniChatApp.Data
{
    public static class GroupSource
    {
        public static List<Group> Groups { get; set; } = new()
        {
            new Group(){GroupName = "Odalar"}
        };
    }
}
