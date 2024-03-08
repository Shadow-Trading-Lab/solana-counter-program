import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProgram } from "../target/types/my_program";
import { assert } from "chai";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

describe("my-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.MyProgram as Program<MyProgram>;
  const myCounter = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("my-counter"),
      provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
  )[0];

  it("Creates and initializes my counter", async () => {
    const txid = await program.methods
      .initialize(new anchor.BN(1234))
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
      console.log("Initialize transaction signature:", txid);
      console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);

      // 驗證計數器賬戶的值是否正確設置為1234
      const account = await program.account.myCounter.fetch(myCounter);
      console.log("The account counter is",account.value.toString(10), "now ");
      assert.ok(account.value.eq(new anchor.BN(1234)));
  });

  it("Add an even number to my counter", async () => {
    const txid = await program.methods
      .addEven(new anchor.BN(420))
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
      })
      .rpc();

      console.log("AddEven transaction signature:", txid);
      console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);

      // 
      const account = await program.account.myCounter.fetch(myCounter);
      console.log("The account counter is",account.value.toString(10), "now ");
      assert.ok(account.value.eq(new anchor.BN(1654)));
  });

  it("Minus an odd number to my counter", async () => {
    const txid = await program.methods
      .minusOdd(new anchor.BN(69))
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
      })
      .rpc();

      console.log("MinusOdd transaction signature:", txid);
      console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);

      // 
      const account = await program.account.myCounter.fetch(myCounter);
      console.log("The account counter is",account.value.toString(10), "now ");
      assert.ok(account.value.eq(new anchor.BN(1585)));
  });

  it("Times an even number to my counter", async () => {
    const txid = await program.methods
      .timesEven(new anchor.BN(2))
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
      })
      .rpc();

      console.log("TimesEven transaction signature:", txid);
      console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);

      // 
      const account = await program.account.myCounter.fetch(myCounter);
      console.log("The account counter is",account.value.toString(10), "now ");
      assert.ok(account.value.eq(new anchor.BN(3170)));
  });

  it("Close my counter account", async () => {
    const txid = await program.methods
      .close()
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
      })
      .rpc();


    console.log("Close counter account transaction signature:", txid);
    console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);
  });
});
