using Microsoft.AspNetCore.SignalR;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Hubs
{
    public class ChatHub:Hub
    {
        public async Task GetNickName(string nick)
        {
            Client client = new()
            {
                ConnectionId = Context.ConnectionId,
                NickName = nick
            };
            ClientSource.Clients.Add(client);
            await Clients.Others.SendAsync("clientJoined", nick);
        }
    }
}
