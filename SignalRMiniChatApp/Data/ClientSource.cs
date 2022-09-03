using SignalRMiniChatApp.Models;

namespace SignalRMiniChatApp.Data
{
    public static class ClientSource
    {
        public static List<Client> Clients { get; } = new()
        {
            new Client(){NickName = "Tümü",ConnectionId = ""}
        };
    }
}
