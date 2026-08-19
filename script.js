document.addEventListener('DOMContentLoaded', () => {
  const levelBtns = document.querySelectorAll('.level-btn');
  const setupPanel = document.getElementById('setup-panel');
  const workoutView = document.getElementById('workout-view');
  
  const digitEl = document.getElementById('digit-timer');
  const num1El = document.getElementById('Num1');
  const num2El = document.getElementById('Num2');

  const ansInput = document.getElementById('ans-input');
  const feedbackMsg = document.getElementById('feedback-msg');
  const backBtn = document.getElementById('backBtn');

  let val1 = 0;
  let val2 = 0;
  let activeIntervalId = null;
  let startTime = 0;
  let elapsedTime = 0;
  let feedbackTimeout = null;

  // 只能输入数字
  // 只能输入数字 + 位数匹配自动校验
ansInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '');

  const correctAnswer = val1 * val2;
  const currentInput = e.target.value;
  // 输入位数和答案位数一致，自动判题
  if (currentInput.length === String(correctAnswer).length) {
    verifyAnswer();
  }
});


  // 随机数生成
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 根据选择的位数生成题目
  function generateProblem(digits) {
    const minVal = 10 ** (digits - 1);
    const maxVal = 10 ** digits - 1;

    val1 = randInt(minVal, maxVal);
    val2 = randInt(minVal, maxVal);

    num1El.textContent = val1;
    num2El.textContent = val2;
  }

  // 启动正计时
  function startCountUp() {
    stopTimer();
    startTime = Date.now();

    activeIntervalId = setInterval(() => {
      elapsedTime = (Date.now() - startTime) / 1000;
      digitEl.textContent = elapsedTime.toFixed(2);
    }, 10);
  }

  // 停止计时
  function stopTimer() {
    if (activeIntervalId) {
      clearInterval(activeIntervalId);
      activeIntervalId = null;
    }
  }

  // 校验答案
  function verifyAnswer() {
    if (!ansInput.value) return;

    const correctAnswer = val1 * val2;
    const userAnswer = Number(ansInput.value);

    // 清除定时的误报清理
    if (feedbackTimeout) clearTimeout(feedbackTimeout);

    ansInput.classList.remove('correct', 'incorrect');

    if (userAnswer === correctAnswer) {
      // 答对：停止计时，提示所用时间
      stopTimer();
      ansInput.classList.add('correct');
      ansInput.disabled = true; // 锁定输入框
      feedbackMsg.className = 'correct-msg';
      feedbackMsg.textContent = `回答正确！你用了 ${elapsedTime.toFixed(2)} 秒`;
    } else {
      // 答错：提示错误，清空输入框，不上报正确答案
      ansInput.classList.add('incorrect');
      feedbackMsg.className = 'incorrect-msg';
      feedbackMsg.textContent = '答错了！';

      // 1 秒后自动重置提示，让用户重新尝试
      feedbackTimeout = setTimeout(() => {
        ansInput.value = '';
        ansInput.classList.remove('incorrect');
        feedbackMsg.textContent = '';
        ansInput.focus();
      }, 1000);
    }
  }

  // 点击难度按钮，立即开始正计时
  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const digits = Number(btn.getAttribute('data-digits'));
      
      // 初始化状态
      ansInput.value = '';
      ansInput.disabled = false;
      ansInput.classList.remove('correct', 'incorrect');
      feedbackMsg.textContent = '';

      generateProblem(digits);
      setupPanel.classList.add('hidden');
      workoutView.classList.remove('hidden');

      ansInput.focus();
      startCountUp();
    });
  });

  // 回车提交判定
  ansInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      verifyAnswer();
    }
  });

  // 返回重选按钮
  backBtn.addEventListener('click', () => {
    stopTimer();
    workoutView.classList.add('hidden');
    setupPanel.classList.remove('hidden');
    digitEl.textContent = '0.00';
  });
  // 调试后门
window.calcDebug = {
  generateProblem,
  startCountUp,
  stopTimer,
  num1El,
  num2El,
  ansInput,
  feedbackMsg,
  get val1(){return val1;},
  get val2(){return val2;},
  get answer(){return val1*val2;}
};

});
