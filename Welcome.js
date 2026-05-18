export class Welcome {
  constructor() {
    this.isOpen = true;
    this.init();
  }
  init() {
    this.modal = document.createElement("div");
    this.modal.id = "welcome-modal";

    this.modal.className =
      "fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300";

    this.modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col p-6 animate-fade-in">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h2 class="text-2xl font-bold text-gray-800">🚀 Excel-like-DataForm</h2>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Vanilla JS</span>
        </div>
        
        <div class="overflow-y-auto pr-2 space-y-4 text-gray-600 text-sm leading-relaxed">
          <p class="font-medium text-gray-700">歡迎體驗！這是一個 100% 原生 JavaScript 打造的高效能雲端試算表元件。</p>
          
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h3 class="font-bold text-gray-800 mb-1">💡 核心技術亮點：</h3>
            <ul class="list-disc list-inside space-y-1">
              <li><strong class="text-blue-600">高效虛擬渲染</strong>：手刻虛擬滾動 (Virtual Scrolling)，50,000 格大數據依然順暢。</li>
              <li><strong class="text-blue-600">狀態驅動架喚</strong>：使用有限狀態機 (FSM) 管理編輯與選取模式。</li>
              <li><strong class="text-blue-600">全鍵盤導航</strong>：支援方向鍵移動、Enter 編輯、Esc 還原舊值。</li>
            </ul>
          </div>

          <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h3 class="font-bold text-blue-800 mb-1">⌨️ 快捷鍵提示：</h3>
            <p>點擊任意格子或使用 <kbd class="px-1 py-0.5 bg-white border rounded shadow">↑</kbd> <kbd class="px-1 py-0.5 bg-white border rounded shadow">↓</kbd> <kbd class="px-1 py-0.5 bg-white border rounded shadow">←</kbd> <kbd class="px-1 py-0.5 bg-white border rounded shadow">→</kbd> 移動焦點。</p>
            <p class="mt-1">選取狀態下<strong class="text-blue-700">直接打字</strong>即可輸入（支援中英文），按 <kbd class="px-1 py-0.5 bg-white border rounded shadow">Enter</kbd> 儲存、<kbd class="px-1 py-0.5 bg-white border rounded shadow">Esc</kbd> 放棄。</p>
          </div>
        </div>
        
        <div class="mt-6 pt-3 border-t flex justify-end">
          <button id="close-modal-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md">
            開始體驗
          </button>
        </div>
      </div>
    `;
    this.modal
      .querySelector("#close-modal-btn")
      .addEventListener("click", () => this.close());
    document.body.appendChild(this.modal);
  }

  close() {
    this.modal.classList.add("opacity-0");
    setTimeout(() => {
      this.modal.remove();
      this.isOpen = false;

      const editor = document.getElementById("excel-editor");
      if (editor) editor.focus();
    }, 300);
  }
}
