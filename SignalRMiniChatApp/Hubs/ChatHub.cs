using Microsoft.AspNetCore.SignalR;
using SignalRMiniChatApp.Data;
using SignalRMiniChatApp.Models;


namespace SignalRMiniChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private Client CurrentClient()
        {
            return ClientSource.Clients.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId)!;
        }
        private Group SelectedGroup(string groupName)
        {
            return GroupSource.Groups.FirstOrDefault(g => g.GroupName == groupName)!;
        }


        public async Task GetNickName(string nickName)
        {
            Client client = new()
            {
                ConnectionId = Context.ConnectionId,
                NickName = nickName
            };
            ClientSource.Clients.Add(client);
            await Clients.Others.SendAsync("clientJoined", nickName);
            await Clients.All.SendAsync("clients", ClientSource.Clients);

        }

        public async Task SendMessageAsync(string message, string clientName)
        {
            //var senderClient = CurrentClient();
            if (clientName.Contains("Tümü"))
            {
                await Clients.Others.SendAsync("receiveMessage", message, CurrentClient()?.NickName);
            }
            else
            {
                var client = ClientSource.Clients.FirstOrDefault(c => c.NickName == clientName);
                await Clients.Client(client!.ConnectionId).SendAsync("receiveMessage", message, CurrentClient().NickName);
            }
        }

        public async Task CreateGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            Group group = new() { GroupName = groupName };
            group.Clients.Add(CurrentClient());

            GroupSource.Groups.Add(group);

            await Clients.All.SendAsync("groupsCreated", GroupSource.Groups);
        }

        public async Task AddClientToGroup(IEnumerable<string> groupNames)
        {
            var client = CurrentClient();
            foreach (var group in groupNames)
            {
                if (!group.Contains("Odalar"))
                {
                    var _group = SelectedGroup(group);
                    var result = _group.Clients.Any(c => c.ConnectionId == Context.ConnectionId);
                    if (!result)
                    {
                        _group.Clients.Add(client);
                        await Groups.AddToGroupAsync(Context.ConnectionId, group);
                    }
                }
            }
        }

        public async Task GetClientsOfGroup(string groupName)
        {

            var group = SelectedGroup(groupName);

            await Clients.Caller.SendAsync("clients", groupName is "-1" or "Odalar" ? ClientSource.Clients : group.Clients);
        }

        public async Task SendMessageToGroupAsync(string groupName, string message)
        {
            await Clients.Group(groupName).SendAsync("receiveMessage", message, CurrentClient().NickName);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            ClientSource.Clients.Remove(CurrentClient());
            await Clients.All.SendAsync("clients", ClientSource.Clients);
            foreach (var group in GroupSource.Groups)
            {
                if (group.Clients.Count == 0)
                {
                    GroupSource.Groups.Remove(group);
                    await Clients.All.SendAsync("groupsCreated", GroupSource.Groups);
                }
            }
        }
    }
}
