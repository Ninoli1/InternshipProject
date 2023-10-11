using CustomerSupport.Models;
using Microsoft.AspNetCore.SignalR;

namespace CustomerSupport.Hub
{
    public class ChatHub : Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IDictionary<string, UserRoom> _connection;
        public ChatHub(IDictionary<string, UserRoom> connection)
        {

            _connection = connection;

        }
        public async Task JoinRoom(UserRoom userRoom) {
            await Groups.AddToGroupAsync(Context.ConnectionId, userRoom.Room);
            _connection[Context.ConnectionId] = userRoom;
            await Clients.Group(userRoom.Room)
                .SendAsync(method: "RecieveMessage", arg1: "User!", arg2: $"{userRoom.User} has Joined the Group", arg3: DateTime.Now);
           await sendConnectedUsers(userRoom.Room!);
        }

        public async Task SendMessage(string message) {

            if (_connection.TryGetValue(Context.ConnectionId, out UserRoom userRoom)) {
                await Clients.Group(userRoom.Room)
                    .SendAsync(method: "RecieveMessage", arg1: userRoom.User, arg2: message,arg3: DateTime.Now);
            }
        }


        public Task sendConnectedUsers(string room) {

            var users = _connection.Values
                .Where(r => r.Room == room)
                .Select(u=> u.User);
            return Clients.Group(room).SendAsync(method: "ConnectedUser");
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (!_connection.TryGetValue(Context.ConnectionId, out UserRoom userRoom))
            {
                return base.OnDisconnectedAsync(exception);
            }
            _connection.Remove(Context.ConnectionId);
            Clients.Group(userRoom.Room)
                .SendAsync(method: "RecieveMessage",arg1:"User" ,arg2:$"{userRoom.User} has left the Group", arg3: DateTime.Now);

            sendConnectedUsers(userRoom.Room!);
            return base.OnDisconnectedAsync(exception);
        }

    }
}
