exports.querys = {
  getUser:
    "select PasswordHash , UserName ,id ,SecurityStamp from AspNetUsers where UserName = @userName ",
  getGateUserID:
    "select GateID from clcpGateUsers where UsersName = userName ",
  getPriceCategory:
    "select PriceCategory from clcpPriceCategoryGates where Gate = @ID ",
  getGateName: "select Name from clcpGates where ID = @ID",
  
  Cards: "select * from clcpCards where CardCode = @cardCode ",
  memberByID: "select Name , ID  from clMembersData where ID = @ID ",

  getLastId:
    "SELECT Top 1 ID FROM clcpTicket WHERE ID = (SELECT MAX(ID) FROM clcpTicket)",
    
  insertBill: `INSERT INTO dbo.clcpTicket ( TransactionStamp, PriceCategoryID,
     UserData, MemberID , CardID  , Amount ,Tax , PaymentMethod , isPrinted )
   VALUES (@TransactionStamp ,@PriceCategoryID, @UserData, @MemberID, @CardID , @Amount, @Tax, @PaymentMethod ,@isPrinted )`,
   
   getCurrentBalance:"SELECT Top 1 Balance FROM clcpCards  WHERE ID = @ID",
   updateBalance:"UPDATE dbo.clcpCards SET Balance = @newBalance WHERE ID = @ID",
   insertBillTickets: `INSERT INTO dbo.clcpTicketD ( TicketID, PriceCategoryID,
    Qty, Price , Tax  , SerialNumber  )
    VALUES (@TicketID , @PriceCategoryID , @Qty ,@Price ,@Tax ,@SerialNumber)`,
};


