# hugging face简介
有哪些能力
# Transformer
  <https://github.com/huggingface/transformers/tree/8e164c5400b7b413c7b8fb32e35132001effc970/src/transformers/models/openai>
# Transfer learning 迁移学习
  ## init model state
  ## pretrained
dataset
## tokenize: to translate text into data that can be processed by the model. Models can only process numbers, so tokenizers need to convert our text inputs to numerical data.
## dataset使用方法

model
## model 类型
## model使用方式

postprocess

完整训练
mini-batch
目前的深度学习训练大多采用mini-batch，在进行反向传播时，会先将通过mini-batch中每个样本计算得到的loss取均值后再进行梯度的反向传播。也就是说，每次反向传播的梯度是mini-batch中每个样本梯度平均化后的结果，所以batch_size的大小就决定了相邻iteration之间的梯度平滑程度。batch_size太小，相邻mini_batch间的样本差异可能较大，这就会使得相邻两次iteration的结果振荡严重，不利于收敛；batch_size越大，那么相邻mini-batch的样本差异就会相对较小，从而有利于模型收敛。但是，如果batch_size过大，会使得相邻mini-batch的样本差异极小，那么相邻iteration的梯度变化也极小，导致训练过程梯度只朝着一个方向下降，最终陷入局部最优无法自拔。
