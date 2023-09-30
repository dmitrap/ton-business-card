import "@stdlib/deploy";
import "@stdlib/ownable";

message SetInformation{
    name: String;
    profesion: String;
    bio: String;
}

message Like{

}

struct User{
    name: String;
    profesion: String;
    bio: String;  
}

contract BusinessCard with Deployable, Ownable {

    owner: Address;
    likeCount: Int as uint32;
    information: User;
    likeManagement: map<Address, Bool>;

    init(information: User) {
        self.owner = sender();
        self.likeCount = 0;
        self.information = information;
    }

    receive(msg: SetInformation){
        self.requireOwner();
        self.information.name = msg.name;
        self.information.profesion = msg.profesion;
        self.information.bio = msg.bio;
    }

    receive(msg: Like){
        let sender: Address = sender();
        if(self.likeManagement.get(sender) != true){
            self.likeCount = self.likeCount + 1;
            self.likeManagement.set(sender, true);
        }
    }

    get fun info(): User {
        return self.information;
    }

    get fun likes(): Int{
        return self.likeCount;
    }


}
