import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProgram } from "../target/types/my_program";
import { assert } from "chai";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

// 描述測試套件的名稱
describe("my-program", () => {
  // 配置客戶端以使用本地集群
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.MyProgram as Program<MyProgram>;
  // 獲取計數器公鑰
  const myCounter = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("my-counter"), // 將字符串“my-counter”編碼為字節
      provider.wallet.publicKey.toBuffer(), // 獲取錢包公鑰的緩存
    ],
    program.programId // 指定程序ID
  )[0];

  // 測試用例：創建並初始化我的計數器
  it("Creates and initializes my counter", async () => {
    // 調用智能合約的初始化方法
    const txid = await program.methods
      .initialize(new anchor.BN(1234)) // 設定初始值為1234
      .accounts({
        myCounter: myCounter, // 指定計數器賬戶
        user: provider.wallet.publicKey, // 指定用戶錢包公鑰
        systemProgram: anchor.web3.SystemProgram.programId, // 系統程序ID
      })
      .rpc(); // 發送交易
    console.log("Initialize transaction signature:", txid);
    console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);

    // 驗證計數器賬戶的值是否正確設置為1234
    const account = await program.account.myCounter.fetch(myCounter);
    console.log("The account counter is",account.value.toString(10), "now ");
    assert.ok(account.value.eq(new anchor.BN(1234)));
  });

  // 測試用例：向我的計數器加上一個偶數
  it("Add an even number to my counter", async () => {
    const txid = await program.methods
      .addEven(new anchor.BN(420)) // 加上值420
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
      })
      .rpc();

    console.log("AddEven transaction signature:", txid);
    console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);

    const account = await program.account.myCounter.fetch(myCounter);
    console.log("The account counter is",account.value.toString(10), "now ");
    assert.ok(account.value.eq(new anchor.BN(1654))); // 驗證加後的值
  });

  // 測試用例：從我的計數器減去一個奇數
  it("Minus an odd number to my counter", async () => {
    const txid = await program.methods
      .minusOdd(new anchor.BN(69)) // 減去值69
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
      })
      .rpc();

    console.log("MinusOdd transaction signature:", txid);
    console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);

    const account = await program.account.myCounter.fetch(myCounter);
    console.log("The account counter is",account.value.toString(10), "now ");
    assert.ok(account.value.eq(new anchor.BN(1585))); // 驗證減後的值
  });

  // 測試用例：將我的計數器乘以一個偶數
  it("Times an even number to my counter", async () => {
    const txid = await program.methods
      .timesEven(new anchor.BN(2)) // 乘以2
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
      })
      .rpc();

    console.log("TimesEven transaction signature:", txid);
    console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);

    const account = await program.account.myCounter.fetch(myCounter);
    console.log("The account counter is",account.value.toString(10), "now ");
    assert.ok(account.value.eq(new anchor.BN(3170))); // 驗證乘後的值
  });

  // 測試用例：關閉我的計數器賬戶
  it("Close my counter account", async () => {
    const txid = await program.methods
      .close() // 調用關閉賬戶的方法
      .accounts({
        myCounter: myCounter,
        user: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Close counter account transaction signature:", txid);
    console.log(`SolScan transaction link: https://solscan.io/tx/${txid}?cluster=devnet`);
  });
});
